"use server"

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getInviteCodes() {
  try {
    console.log('Server Action: Fetching invite codes...');
    
    const inviteCodes = await prisma.inviteCode.findMany({
      include: {
        orgs: {
          select: {
            id: true,
            name: true,
            username: true,
            pictureUrl: true,
            verificationStatus: true,
            verifiedAt: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Successfully fetched invite codes: ${inviteCodes.length}`);

    const inviteCodesWithFormattedDates = inviteCodes.map(inviteCode => ({
      ...inviteCode,
      createdAt: inviteCode.createdAt.toISOString(),
      updatedAt: inviteCode.updatedAt.toISOString(),
      expiresAt: inviteCode.expiresAt.toISOString(),
      sentAt: inviteCode.sentAt?.toISOString() || null,
    }));

    return { success: true, data: inviteCodesWithFormattedDates };
  } catch (error) {
    console.error('Error fetching invite codes:', error);
    return { success: false, error: 'Failed to fetch invite codes' };
  }
}

export async function deleteInviteCode(id: string) {
  try {
    console.log(`Server Action: Deleting invite code ${id}...`);

    // Check if invite code exists
    const existingInviteCode = await prisma.inviteCode.findUnique({
      where: { id }
    });

    if (!existingInviteCode) {
      return { success: false, error: 'Invite code not found' };
    }

    // Delete invite code
    await prisma.inviteCode.delete({
      where: { id }
    });

    console.log(`Successfully deleted invite code: ${id}`);
    revalidatePath('/invite-codes');

    return { success: true, message: 'Invite code deleted successfully' };
  } catch (error) {
    console.error('Error deleting invite code:', error);
    return { success: false, error: 'Failed to delete invite code' };
  }
}
