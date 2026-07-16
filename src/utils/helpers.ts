/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CustomerJob, SystemStats } from '../types';

// Format number to INR
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format ISO string to readable date-time
export const formatDateTime = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) + ', ' + date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date only (YYYY-MM-DD) to friendly format
export const formatFriendlyDate = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Calculate SLR Tech Hub KPIs
export const calculateSystemStats = (jobs: CustomerJob[]): SystemStats => {
  const todayStr = '2026-07-16'; // Anchor date of environment
  
  // Jobs created today
  const todayJobsCount = jobs.filter(job => {
    const jobDate = job.createdAt.split('T')[0];
    return jobDate === todayStr;
  }).length;

  // Pending Jobs: anything not Delivered or Cancelled
  const pendingJobsCount = jobs.filter(job => job.status !== 'Delivered').length;

  // Completed Jobs: strictly Delivered or Ready
  const completedJobsCount = jobs.filter(job => job.status === 'Delivered' || job.status === 'Ready').length;

  // Total Revenue: sum of all payments received across ALL jobs
  let totalRevenue = 0;
  jobs.forEach(job => {
    job.paymentHistory.forEach(pay => {
      totalRevenue += pay.amount;
    });
  });

  // Pending Amount: balance on all pending/active jobs
  let pendingRevenue = 0;
  jobs.forEach(job => {
    if (job.status !== 'Delivered') {
      pendingRevenue += job.balance;
    }
  });

  return {
    todayJobsCount,
    pendingJobsCount,
    completedJobsCount,
    totalRevenue,
    pendingRevenue,
  };
};

// Generate pre-filled WhatsApp link
export const getWhatsAppLink = (job: CustomerJob): string => {
  let message = '';
  
  if (job.status === 'Ready') {
    message = `Dear *${job.customerName}*,\n\nYour *${job.brand} ${job.model}* (Job ID: *${job.id}*) is *READY* for pickup at *SLR TECH HUB*! 🚀\n\n💵 *Invoice Summary*:\n• Total Amount: ${formatINR(job.amount)}\n• Advance Paid: ${formatINR(job.advance)}\n• *Balance to Pay: ${formatINR(job.balance)}*\n\nPlease visit our store to collect your device.\n\nThank you for choosing SLR TECH HUB! 🙏`;
  } else if (job.status === 'Delivered') {
    message = `Dear *${job.customerName}*,\n\nYour *${job.brand} ${job.model}* (Job ID: *${job.id}*) has been successfully *DELIVERED*. ✅\n\nWe hope you are satisfied with our repair service. If you face any issues, please feel free to reach back to us.\n\nThank you for choosing *SLR TECH HUB*!`;
  } else {
    message = `Dear *${job.customerName}*,\n\nStatus update for your *${job.brand} ${job.model}* (Job ID: *${job.id}*) at *SLR TECH HUB*:\n\n*Current Status:* ${job.status}\n\nWe will update you as soon as there is further progress!`;
  }

  // Format phone number (add 91 country code if 10-digit number is given)
  let cleanPhone = job.phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

// Real-time synchronization event emitter/listener using BroadcastChannel
let syncChannel: BroadcastChannel | null = null;

export const initSyncChannel = (onSyncNeeded: () => void) => {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      syncChannel = new BroadcastChannel('slr_tech_hub_sync');
      syncChannel.onmessage = (event) => {
        if (event.data === 'SYNC_JOBS') {
          onSyncNeeded();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  }
};

export const triggerSyncUpdate = () => {
  if (syncChannel) {
    syncChannel.postMessage('SYNC_JOBS');
  }
};
