"use server"

import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Singleton Prisma client
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

export async function getNGOs() {
  try {
    console.log('Server Action: Fetching NGOs...');
    
    const orgs = await prisma.org.findMany({
      where: { verificationStatus: 'verified' },
      orderBy: { createdAt: 'desc' }
    });
    
    // Remove passwords from response for security
    const orgsWithoutPasswords = orgs.map(org => {
      const { password, ...orgWithoutPassword } = org;
      return orgWithoutPassword;
    });

    console.log('Successfully fetched NGOs:', orgsWithoutPasswords.length);
    return { success: true, data: orgsWithoutPasswords };
  } catch (error) {
    console.error('Server Action error:', error);
    return { 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function createNGO(formData: FormData) {
  try {
    console.log('Server Action: Creating NGO...');
    
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
      return { 
        success: false, 
        error: 'Missing required fields' 
      };
    }

    // Generate unique ID
    function generateId() {
      return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Hash password
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
          return { 
            success: false, 
            error: 'Failed to upload picture' 
          };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);
        
        pictureUrl = urlData.publicUrl;
        console.log('Picture uploaded successfully:', pictureUrl);
      } catch (uploadError) {
        console.error('Picture upload error:', uploadError);
        return { 
          success: false, 
          error: 'Failed to upload picture' 
        };
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
    
    // Revalidate the NGOs page
    revalidatePath('/ngos');
    
    return { success: true, data: orgWithoutPassword };
  } catch (error) {
    console.error('Server Action error:', error);
    return { 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateNGO(id: string, formData: FormData) {
  try {
    console.log('Server Action: Updating NGO...', id);
    
    const username = formData.get('username') as string;
    const name = formData.get('name') as string;
    const country = formData.get('country') as string;
    const socialMediaPlatform = formData.get('socialMediaPlatform') as string;
    const socialMediaHandle = formData.get('socialMediaHandle') as string;
    const verificationStatus = formData.get('verificationStatus') as string;
    const picture = formData.get('picture') as File | null;

    // Validate required fields
    if (!username || !name || !country || !socialMediaPlatform || !socialMediaHandle) {
      return { 
        success: false, 
        error: 'Missing required fields' 
      };
    }

    // Check if NGO exists
    const existingOrg = await prisma.org.findUnique({
      where: { id }
    });

    if (!existingOrg) {
      return { 
        success: false, 
        error: 'NGO not found' 
      };
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
          return { 
            success: false, 
            error: 'Failed to upload picture' 
          };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);
        
        pictureUrl = urlData.publicUrl;
        console.log('Picture uploaded successfully:', pictureUrl);
      } catch (uploadError) {
        console.error('Picture upload error:', uploadError);
        return { 
          success: false, 
          error: 'Failed to upload picture' 
        };
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
    
    // Revalidate the NGOs page
    revalidatePath('/ngos');
    
    return { success: true, data: orgWithoutPassword };
  } catch (error) {
    console.error('Server Action error:', error);
    return { 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deleteNGO(id: string) {
  try {
    console.log('Server Action: Deleting NGO...', id);
    
    // First, get the organization to find its invite code
    const org = await prisma.org.findUnique({
      where: { id },
      select: { 
        id: true, 
        inviteCodeUsed: true,
        name: true,
        username: true
      }
    });

    if (!org) {
      return { 
        success: false, 
        error: 'NGO not found' 
      };
    }

    // Delete the associated invite code if it exists
    if (org.inviteCodeUsed) {
      try {
        await prisma.inviteCode.delete({
          where: { code: org.inviteCodeUsed }
        });
        console.log('Successfully deleted associated invite code:', org.inviteCodeUsed);
      } catch (inviteCodeError) {
        console.error('Error deleting invite code:', inviteCodeError);
        // Continue with NGO deletion even if invite code deletion fails
      }
    }
    
    // Delete organization
    const result = await prisma.org.delete({
      where: { id },
      select: { id: true }
    });

    console.log('Successfully deleted NGO:', result.id);
    
    // Revalidate the NGOs and invite codes pages
    revalidatePath('/ngos');
    revalidatePath('/invite-codes');
    
    return { success: true, message: 'NGO and associated invite code deleted successfully' };
  } catch (error) {
    console.error('Server Action error:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return { 
        success: false, 
        error: 'NGO not found' 
      };
    }
    
    return { 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
