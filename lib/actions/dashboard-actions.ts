"use server"

import { PrismaClient } from '@prisma/client'

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getDashboardStats() {
  try {
    console.log('Server Action: Fetching dashboard stats...');

    // Get current date and last month
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Parallel queries for better performance
    const [
      totalNGOs,
      verifiedNGOs,
      pendingRequests,
      underReviewRequests,
      approvedRequests,
      totalProtests,
      activeProtests,
      totalInviteCodes,
      activeInviteCodes,
      usedInviteCodes,
      recentNGOs,
      recentRequests,
      recentProtests,
      recentInviteCodes
    ] = await Promise.all([
      // NGO counts
      prisma.org.count(),
      prisma.org.count({ where: { verificationStatus: 'verified' } }),
      prisma.org.count({ where: { verificationStatus: 'pending' } }),
      prisma.org.count({ where: { verificationStatus: 'under_review' } }),
      prisma.org.count({ where: { verificationStatus: 'approved' } }),
      
      // Protest counts
      prisma.protest.count(),
      prisma.protest.count({ where: { dateTime: { gt: now } } }), // Future protests
      
      // Invite code counts
      prisma.inviteCode.count(),
      prisma.inviteCode.count({ 
        where: { 
          isUsed: false,
          expiresAt: { gt: now }
        } 
      }),
      prisma.inviteCode.count({ where: { isUsed: true } }),
      
      // Recent data
      prisma.org.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          username: true,
          verificationStatus: true,
          createdAt: true,
          country: true
        }
      }),
      prisma.org.findMany({
        where: {
          verificationStatus: { in: ['pending', 'under_review'] }
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          username: true,
          verificationStatus: true,
          createdAt: true,
          country: true
        }
      }),
      prisma.protest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        }
      }),
      prisma.inviteCode.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          orgs: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        }
      })
    ]);

    // Calculate month-over-month changes
    const ngosThisMonth = await prisma.org.count({
      where: {
        createdAt: { gte: thisMonth }
      }
    });

    const ngosLastMonth = await prisma.org.count({
      where: {
        createdAt: { gte: lastMonth, lt: thisMonth }
      }
    });

    const protestsThisMonth = await prisma.protest.count({
      where: {
        createdAt: { gte: thisMonth }
      }
    });

    const protestsLastMonth = await prisma.protest.count({
      where: {
        createdAt: { gte: lastMonth, lt: thisMonth }
      }
    });

    const ngosChange = ngosLastMonth > 0 ? ((ngosThisMonth - ngosLastMonth) / ngosLastMonth * 100) : 0;
    const protestsChange = protestsLastMonth > 0 ? ((protestsThisMonth - protestsLastMonth) / protestsLastMonth * 100) : 0;

    console.log('Successfully fetched dashboard stats');

    return {
      success: true,
      data: {
        stats: {
          totalNGOs,
          verifiedNGOs,
          pendingRequests,
          underReviewRequests,
          approvedRequests,
          totalProtests,
          activeProtests,
          totalInviteCodes,
          activeInviteCodes,
          usedInviteCodes,
          ngosChange: Math.round(ngosChange),
          protestsChange: Math.round(protestsChange)
        },
        recent: {
          ngos: recentNGOs.map(ngo => ({
            ...ngo,
            createdAt: ngo.createdAt.toISOString()
          })),
          requests: recentRequests.map(req => ({
            ...req,
            createdAt: req.createdAt.toISOString()
          })),
          protests: recentProtests.map(protest => ({
            ...protest,
            createdAt: protest.createdAt.toISOString(),
            dateTime: protest.dateTime.toISOString()
          })),
          inviteCodes: recentInviteCodes.map(code => ({
            ...code,
            createdAt: code.createdAt.toISOString(),
            expiresAt: code.expiresAt.toISOString(),
            sentAt: code.sentAt?.toISOString() || null
          }))
        }
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}
