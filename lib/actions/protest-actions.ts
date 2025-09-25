"use server"

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getProtests() {
  try {
    console.log('Server Action: Fetching protests...');
    
    const protests = await prisma.protest.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            username: true,
            pictureUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Successfully fetched protests: ${protests.length}`);

    const protestsWithFormattedDates = protests.map(protest => ({
      ...protest,
      createdAt: protest.createdAt.toISOString(),
      updatedAt: protest.updatedAt.toISOString(),
      dateTime: protest.dateTime.toISOString(),
    }));

    return { success: true, data: protestsWithFormattedDates };
  } catch (error) {
    console.error('Error fetching protests:', error);
    return { success: false, error: 'Failed to fetch protests' };
  }
}

export async function createProtest(formData: FormData) {
  try {
    console.log('Server Action: Creating protest...');
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const dateTime = formData.get('dateTime') as string;
    const organizerId = formData.get('organizerId') as string;
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;
    const picture = formData.get('picture') as File | null;

    // Validate required fields
    if (!title || !location || !dateTime || !organizerId) {
      return { success: false, error: 'Missing required fields' };
    }

    function generateId() {
      return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    let pictureUrl: string | null = null;
    if (picture && picture.size > 0) {
      // Handle picture upload to Supabase if needed
      // For now, we'll just store the filename
      pictureUrl = `protest-${generateId()}.${picture.name.split('.').pop()}`;
    }

    const protest = await prisma.protest.create({
      data: {
        id: generateId(),
        title,
        description: description || null,
        location,
        dateTime: new Date(dateTime),
        organizerId,
        city: city || null,
        country: country || null,
        pictureUrl,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            username: true,
            pictureUrl: true,
          }
        }
      }
    });

    console.log(`Successfully created protest: ${protest.id}`);
    revalidatePath('/protests');

    return {
      success: true,
      data: {
        ...protest,
        createdAt: protest.createdAt.toISOString(),
        updatedAt: protest.updatedAt.toISOString(),
        dateTime: protest.dateTime.toISOString(),
      }
    };
  } catch (error) {
    console.error('Error creating protest:', error);
    return { success: false, error: 'Failed to create protest' };
  }
}

export async function updateProtest(id: string, formData: FormData) {
  try {
    console.log(`Server Action: Updating protest ${id}...`);
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const dateTime = formData.get('dateTime') as string;
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;
    const picture = formData.get('picture') as File | null;

    // Validate required fields
    if (!title || !location || !dateTime) {
      return { success: false, error: 'Missing required fields' };
    }

    let pictureUrl: string | null = undefined;
    if (picture && picture.size > 0) {
      // Handle picture upload to Supabase if needed
      // For now, we'll just store the filename
      function generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      }
      pictureUrl = `protest-${generateId()}.${picture.name.split('.').pop()}`;
    }

    const updateData: any = {
      title,
      description: description || null,
      location,
      dateTime: new Date(dateTime),
      city: city || null,
      country: country || null,
    };

    if (pictureUrl !== undefined) {
      updateData.pictureUrl = pictureUrl;
    }

    const protest = await prisma.protest.update({
      where: { id },
      data: updateData,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            username: true,
            pictureUrl: true,
          }
        }
      }
    });

    console.log(`Successfully updated protest: ${protest.id}`);
    revalidatePath('/protests');

    return {
      success: true,
      data: {
        ...protest,
        createdAt: protest.createdAt.toISOString(),
        updatedAt: protest.updatedAt.toISOString(),
        dateTime: protest.dateTime.toISOString(),
      }
    };
  } catch (error) {
    console.error('Error updating protest:', error);
    return { success: false, error: 'Failed to update protest' };
  }
}

export async function deleteProtest(id: string) {
  try {
    console.log(`Server Action: Deleting protest ${id}...`);

    // Check if protest exists
    const existingProtest = await prisma.protest.findUnique({
      where: { id }
    });

    if (!existingProtest) {
      return { success: false, error: 'Protest not found' };
    }

    // Delete protest
    await prisma.protest.delete({
      where: { id }
    });

    console.log(`Successfully deleted protest: ${id}`);
    revalidatePath('/protests');

    return { success: true, message: 'Protest deleted successfully' };
  } catch (error) {
    console.error('Error deleting protest:', error);
    return { success: false, error: 'Failed to delete protest' };
  }
}
