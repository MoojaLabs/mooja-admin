import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

// Singleton Prisma client to avoid connection overhead
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Supabase client for file uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('API Route: Updating NGO...', id);
    
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const name = formData.get('name') as string;
    const country = formData.get('country') as string;
    const socialMediaPlatform = formData.get('socialMediaPlatform') as string;
    const socialMediaHandle = formData.get('socialMediaHandle') as string;
    const verificationStatus = formData.get('verificationStatus') as string;
    const picture = formData.get('picture') as File | null;

    // Validate required fields
    if (!username || !name || !country || !socialMediaPlatform || !socialMediaHandle) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Check if NGO exists
    const existingOrg = await prisma.org.findUnique({
      where: { id }
    });

    if (!existingOrg) {
      return NextResponse.json({ 
        error: 'NGO not found' 
      }, { status: 404 });
    }

    let pictureUrl = existingOrg.pictureUrl;

    // Handle picture upload if provided
    if (picture && picture.size > 0) {
      try {
        const fileExt = picture.name.split('.').pop();
        const fileName = `org-${id}-${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(fileName, picture, {
            contentType: picture.type,
            upsert: false
          });

        if (error) {
          console.error('Supabase upload error:', error);
          return NextResponse.json({ 
            error: 'Failed to upload picture' 
          }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);
        
        pictureUrl = urlData.publicUrl;
        console.log('Picture uploaded successfully:', pictureUrl);
      } catch (uploadError) {
        console.error('Picture upload error:', uploadError);
        return NextResponse.json({ 
          error: 'Failed to upload picture' 
        }, { status: 500 });
      }
    }

    // Update organization
    const org = await prisma.org.update({
      where: { id },
      data: {
        username,
        name,
        country,
        socialMediaPlatform,
        socialMediaHandle,
        verificationStatus: verificationStatus || 'verified',
        verifiedAt: verificationStatus === 'verified' ? new Date() : null,
        pictureUrl
      }
    });

    // Remove password from response for security
    const { password: _, ...orgWithoutPassword } = org;

    console.log('Successfully updated NGO:', orgWithoutPassword.id);
    return NextResponse.json({ data: orgWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] DELETE API started`);
  
  try {
    const paramsStart = Date.now();
    const { id } = await params;
    const paramsTime = Date.now() - paramsStart;
    console.log(`[${new Date().toISOString()}] Params resolved in ${paramsTime}ms`);
    
    console.log('API Route: Deleting NGO...', id);
    
    const dbStart = Date.now();
    // Delete organization directly - Prisma will throw if not found
    const result = await prisma.org.delete({
      where: { id },
      select: { id: true } // Only select what we need
    });
    const dbTime = Date.now() - dbStart;
    console.log(`[${new Date().toISOString()}] Database delete completed in ${dbTime}ms - Result:`, result);

    const totalTime = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Successfully deleted NGO: ${id} - Total time: ${totalTime}ms`);
    
    const responseStart = Date.now();
    const response = NextResponse.json({ message: 'NGO deleted successfully' }, { status: 200 });
    const responseTime = Date.now() - responseStart;
    console.log(`[${new Date().toISOString()}] Response created in ${responseTime}ms`);
    
    return response;
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] API Route error after ${totalTime}ms:`, error);
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ 
        error: 'NGO not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
