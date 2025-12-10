'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export async function updateProfile(formData: FormData) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const userId = (session.user as { id: string }).id;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  // Check if email is already in use by another user
  const existingUser = await prisma.user.findFirst({
    where: { 
      email, 
      id: { not: userId } 
    },
  });

  if (existingUser) {
    throw new Error('Email is already in use');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });

  revalidatePath('/settings');
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const userId = (session.user as { id: string }).id;
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error('All fields are required');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user?.password) {
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password);

  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { success: true };
}

export async function updateNotificationSettings(formData: FormData) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // In a real app, you'd have a UserSettings or NotificationPreferences model
  // For now, we'll just acknowledge the settings
  const emailNotifications = formData.get('emailNotifications') === 'true';
  const projectUpdates = formData.get('projectUpdates') === 'true';
  const taskReminders = formData.get('taskReminders') === 'true';
  const weeklyDigest = formData.get('weeklyDigest') === 'true';

  // Log or store these preferences somewhere
  console.log('Notification settings:', {
    emailNotifications,
    projectUpdates,
    taskReminders,
    weeklyDigest,
  });

  revalidatePath('/settings');
  return { success: true };
}

export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  const userId = (session.user as { id: string }).id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}
