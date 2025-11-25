'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

// Leave Management
export async function submitLeaveRequest(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  const employeeId = formData.get('employeeId') as string;
  const leaveType = formData.get('leaveType') as string;
  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);
  const reason = formData.get('reason') as string;

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  await prisma.leaveRequest.create({
    data: { employeeId, leaveType, startDate, endDate, days, reason, tenantId: tenant.id },
  });

  revalidatePath('/hr/leave');
}

export async function approveLeave(formData: FormData) {
  const { session } = await requireTenantMembership();
  const leaveId = formData.get('leaveId') as string;
  
  await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: { status: 'APPROVED', approvedBy: (session.user as { id: string }).id, approvedAt: new Date() },
  });

  revalidatePath('/hr/leave');
}

export async function rejectLeave(formData: FormData) {
  const { session } = await requireTenantMembership();
  const leaveId = formData.get('leaveId') as string;
  const reason = formData.get('reason') as string;
  
  await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: { status: 'REJECTED', approvedBy: (session.user as { id: string }).id, approvedAt: new Date(), rejectionReason: reason },
  });

  revalidatePath('/hr/leave');
}

// Attendance
export async function clockIn(formData: FormData) {
  const { tenant } = await requireTenantMembership();
  const employeeId = formData.get('employeeId') as string;
  
  await prisma.attendance.create({
    data: { employeeId, clockIn: new Date(), date: new Date(), tenantId: tenant.id },
  });

  revalidatePath('/hr/attendance');
}

export async function clockOut(formData: FormData) {
  const attendanceId = formData.get('attendanceId') as string;
  const attendance = await prisma.attendance.findUnique({ where: { id: attendanceId } });

  if (attendance && !attendance.clockOut) {
    const clockOut = new Date();
    const totalHours = (clockOut.getTime() - attendance.clockIn.getTime()) / (1000 * 60 * 60);
    const overtime = Math.max(0, totalHours - 8);

    await prisma.attendance.update({
      where: { id: attendanceId },
      data: { clockOut, totalHours, overtime },
    });
  }

  revalidatePath('/hr/attendance');
}

export const LEAVE_TYPES = ['VACATION', 'SICK', 'PERSONAL', 'UNPAID'] as const;
