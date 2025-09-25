"use server"

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export interface RequestData {
  id: string;
  username: string;
  name: string | null;
  country: string | null;
  socialMediaPlatform: string | null;
  socialMediaHandle: string | null;
  pictureUrl: string | null;
  verificationStatus: string;
  inviteCodeUsed: string | null;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
}

export async function getRequests() {
  try {
    console.log('Server Action: Fetching requests...');
    
    const requests = await prisma.org.findMany({
      where: { 
        verificationStatus: {
          in: ['pending', 'under_review', 'approved', 'rejected']
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Successfully fetched requests: ${requests.length}`);
    
    // Remove passwords from response for security
    const requestsWithoutPasswords = requests.map(request => {
      const { password, ...requestWithoutPassword } = request;
      return {
        ...requestWithoutPassword,
        createdAt: request.createdAt.toISOString(),
        updatedAt: request.updatedAt.toISOString(),
        verifiedAt: request.verifiedAt?.toISOString() || null,
      };
    });
    
    return { success: true, data: requestsWithoutPasswords };
  } catch (error) {
    console.error('Error fetching requests:', error);
    return { success: false, error: 'Failed to fetch requests' };
  }
}

// Generate unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Generate unique invite code
async function generateUniqueInviteCode() {
  function baseCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  // Try until unique
  while (true) {
    const code = baseCode();
    const existing = await prisma.inviteCode.findUnique({ where: { code } });
    if (!existing) return code;
  }
}

export async function updateRequestStatus(id: string, status: 'pending' | 'under_review' | 'verified' | 'rejected') {
  try {
    console.log(`Server Action: Updating request ${id} to status ${status}`);
    
    // If approving, generate invite code first
    if (status === 'verified') {
      // Ensure org exists and is under review
      const org = await prisma.org.findUnique({ where: { id } });
      if (!org) {
        return { success: false, error: 'Organization not found' };
      }

      if (org.verificationStatus !== 'under_review') {
        return { success: false, error: 'Organization must be under review to approve' };
      }

      // Clean up any existing unused invite codes for this org
      await prisma.inviteCode.deleteMany({
        where: {
          isUsed: false,
          sentTo: { in: [org.name || '', org.username || '', org.id] }
        }
      });

      // Generate unique invite code
      const code = await generateUniqueInviteCode();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Create invite code
      const invite = await prisma.inviteCode.create({
        data: {
          id: generateId(),
          code,
          isUsed: false,
          expiresAt,
          sentTo: org.name || org.username || org.id,
          sentAt: now
        }
      });

      // Update organization status to approved (not verified yet)
      const updatedRequest = await prisma.org.update({
        where: { id },
        data: { 
          verificationStatus: 'approved',
          verifiedAt: null // Will be set when they use the invite code in mobile app
        }
      });
      
      const { password, ...requestWithoutPassword } = updatedRequest;
      
      console.log(`Successfully approved request ${id} and generated invite code: ${code}`);
      
      // Revalidate the requests page to show updated data
      revalidatePath('/requests');
      
      return { 
        success: true, 
        data: {
          ...requestWithoutPassword,
          createdAt: updatedRequest.createdAt.toISOString(),
          updatedAt: updatedRequest.updatedAt.toISOString(),
          verifiedAt: updatedRequest.verifiedAt?.toISOString() || null,
        },
        inviteCode: {
          code: invite.code,
          expiresAt: invite.expiresAt.toISOString()
        }
      };
    } else {
      // For other status updates (pending, under_review, rejected)
      const updatedRequest = await prisma.org.update({
        where: { id },
        data: { 
          verificationStatus: status,
          verifiedAt: status === 'verified' ? new Date() : null
        }
      });
      
      const { password, ...requestWithoutPassword } = updatedRequest;
      
      console.log(`Successfully updated request ${id} to ${status}`);
      
      // Revalidate the requests page to show updated data
      revalidatePath('/requests');
      
      return { 
        success: true, 
        data: {
          ...requestWithoutPassword,
          createdAt: updatedRequest.createdAt.toISOString(),
          updatedAt: updatedRequest.updatedAt.toISOString(),
          verifiedAt: updatedRequest.verifiedAt?.toISOString() || null,
        }
      };
    }
  } catch (error) {
    console.error('Error updating request status:', error);
    return { success: false, error: 'Failed to update request status' };
  }
}
