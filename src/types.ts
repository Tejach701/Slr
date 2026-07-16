/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'staff1' | 'staff2';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  color: string; // Tailwind color class for user avatars
  password?: string;
}

export type JobStatus = 'Pending' | 'Checking' | 'Repairing' | 'Waiting for Parts' | 'Ready' | 'Delivered';

export interface PaymentRecord {
  id: string;
  date: string; // ISO string
  amount: number;
  type: 'Advance' | 'Interim' | 'Final';
  receivedBy: string;
}

export interface HistoryRecord {
  id: string;
  date: string; // ISO string
  updatedBy: string;
  status: JobStatus;
  remarks: string;
}

export interface CustomerJob {
  id: string;
  customerName: string;
  phone: string;
  brand: string;
  model: string;
  serialNumber: string;
  complaint: string;
  accessories: string;
  amount: number; // Estimated/Total amount
  advance: number; // Advance paid
  balance: number; // amount - advance
  status: JobStatus;
  deliveryDate: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  paymentHistory: PaymentRecord[];
  complaintHistory: HistoryRecord[];
}

export interface SystemStats {
  todayJobsCount: number;
  pendingJobsCount: number;
  completedJobsCount: number;
  totalRevenue: number;
  pendingRevenue: number;
}
