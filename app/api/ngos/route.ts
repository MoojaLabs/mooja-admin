import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

// Singleton Prisma client to avoid connection overhead
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Supabase client for file uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    console.log('API Route: Fetching NGOs...');
    
    // Fetch verified organizations using Prisma (like the old admin)
    const orgs = await prisma.org.findMany({
      where: { verificationStatus: 'verified' },
      orderBy: { createdAt: 'desc' }
    });
    
    // Remove passwords from response for security (like the old admin)
    const orgsWithoutPasswords = orgs.map(org => {
      const { password, ...orgWithoutPassword } = org;
      return orgWithoutPassword;
    });

    console.log('Successfully fetched NGOs:', orgsWithoutPasswords.length);
    return NextResponse.json({ data: orgsWithoutPasswords });
  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('API Route: Creating NGO...');
    
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const name = formData.get('name') as string;
    const country = formData.get('country') as string;
    const socialMediaPlatform = formData.get('socialMediaPlatform') as string;
    const socialMediaHandle = formData.get('socialMediaHandle') as string;
    const password = formData.get('password') as string;
    const verificationStatus = formData.get('verificationStatus') as string;
    const picture = formData.get('picture') as File | null;

    // Validate required fields
    if (!username || !name || !country || !socialMediaPlatform || !socialMediaHandle || !password) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Generate unique ID (like the old admin)
    function generateId() {
      return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Hash password (like the old admin)
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let pictureUrl: string | null = null;

    // Handle picture upload if provided
    if (picture && picture.size > 0) {
      try {
        const fileExt = picture.name.split('.').pop();
        const fileName = `org-${generateId()}.${fileExt}`;
        
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

    // Create organization
    const org = await prisma.org.create({
      data: {
        id: generateId(),
        username,
        name,
        country,
        socialMediaPlatform,
        socialMediaHandle,
        password: hashedPassword,
        verificationStatus: verificationStatus || 'verified',
        verifiedAt: verificationStatus === 'verified' ? new Date() : null,
        pictureUrl
      }
    });

    // Remove password from response for security
    const { password: _, ...orgWithoutPassword } = org;

    console.log('Successfully created NGO:', orgWithoutPassword.id);
    return NextResponse.json({ data: orgWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
