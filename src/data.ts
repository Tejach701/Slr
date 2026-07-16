/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, CustomerJob } from './types';

export const SYSTEM_USERS: User[] = [
  {
    email: 'slrtechhub@gmail.com',
    name: 'SLR Admin',
    role: 'admin',
    color: 'bg-blue-600 text-white',
    password: 'Slrtech@123',
  },
  {
    email: 'aadil@gmail.com',
    name: 'Aadil',
    role: 'staff1',
    color: 'bg-emerald-600 text-white',
    password: 'Adil@123',
  },
  {
    email: 'ramswamy@gmail.com',
    name: 'Ramswamy',
    role: 'staff2',
    color: 'bg-amber-600 text-white',
    password: 'Ram @123',
  },
];

// Helper to get past dates relative to current date (2026-07-16)
const getPastDateString = (daysAgo: number): string => {
  const d = new Date('2026-07-16T12:00:00-07:00');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const getFutureDateString = (daysAhead: number): string => {
  const d = new Date('2026-07-16T12:00:00-07:00');
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export const INITIAL_JOBS: CustomerJob[] = [
  {
    id: 'SLR-1001',
    customerName: 'Anil Kumar',
    phone: '9876543210',
    brand: 'Dell',
    model: 'Inspiron 15 3000',
    serialNumber: 'DL3498FH29',
    complaint: 'Blue screen error on startup and overheating.',
    accessories: 'Charger, Laptop Sleeve',
    amount: 4500,
    advance: 1000,
    balance: 3500,
    status: 'Checking',
    deliveryDate: getFutureDateString(1),
    createdAt: getPastDateString(2),
    updatedAt: getPastDateString(1),
    paymentHistory: [
      {
        id: 'PAY-1',
        date: getPastDateString(2),
        amount: 1000,
        type: 'Advance',
        receivedBy: 'Staff Kumar',
      }
    ],
    complaintHistory: [
      {
        id: 'HIST-1',
        date: getPastDateString(2),
        updatedBy: 'Staff Kumar',
        status: 'Pending',
        remarks: 'Job registered. Customer reported blue screen after windows update.',
      },
      {
        id: 'HIST-2',
        date: getPastDateString(1),
        updatedBy: 'Staff Kumar',
        status: 'Checking',
        remarks: 'Disassembled laptop. Thermal paste needs replacement. Running diagnostics on hard drive.',
      }
    ]
  },
  {
    id: 'SLR-1002',
    customerName: 'Meera Nair',
    phone: '9988776655',
    brand: 'Apple',
    model: 'MacBook Air M1 (2020)',
    serialNumber: 'FVFG92KLQ05D',
    complaint: 'Water spill on keyboard. Laptop not turning on.',
    accessories: 'Box only',
    amount: 12000,
    advance: 3000,
    balance: 9000,
    status: 'Waiting for Parts',
    deliveryDate: getFutureDateString(5),
    createdAt: getPastDateString(4),
    updatedAt: getPastDateString(2),
    paymentHistory: [
      {
        id: 'PAY-2',
        date: getPastDateString(4),
        amount: 3000,
        type: 'Advance',
        receivedBy: 'SLR Admin',
      }
    ],
    complaintHistory: [
      {
        id: 'HIST-3',
        date: getPastDateString(4),
        updatedBy: 'SLR Admin',
        status: 'Pending',
        remarks: 'Water spill case. Advised customer not to charge. Logged in and disassembled for chemical wash.',
      },
      {
        id: 'HIST-4',
        date: getPastDateString(3),
        updatedBy: 'Staff Priya',
        status: 'Repairing',
        remarks: 'Motherboard cleaned. Keyboard backlight is damaged. Short circuit detected near RAM rail, replaced capacitors.',
      },
      {
        id: 'HIST-5',
        date: getPastDateString(2),
        updatedBy: 'Staff Priya',
        status: 'Waiting for Parts',
        remarks: 'Original keyboard module ordered from distributor. Awaiting delivery.',
      }
    ]
  },
  {
    id: 'SLR-1003',
    customerName: 'Rohan Sharma',
    phone: '9123456789',
    brand: 'HP',
    model: 'Pavilion Gaming 15',
    serialNumber: 'CND0284X8L',
    complaint: 'Keyboard replacement (some keys not working) and general servicing.',
    accessories: 'Charger',
    amount: 3200,
    advance: 0,
    balance: 3200,
    status: 'Ready',
    deliveryDate: '2026-07-16', // Today
    createdAt: getPastDateString(3),
    updatedAt: '2026-07-16T10:30:00-07:00',
    paymentHistory: [],
    complaintHistory: [
      {
        id: 'HIST-6',
        date: getPastDateString(3),
        updatedBy: 'Staff Kumar',
        status: 'Pending',
        remarks: 'Logged. Advised estimated amount 3200. No advance paid.',
      },
      {
        id: 'HIST-7',
        date: getPastDateString(1),
        updatedBy: 'Staff Kumar',
        status: 'Repairing',
        remarks: 'New keyboard panel fitted. Internal cleaning done. Fans lubricated.',
      },
      {
        id: 'HIST-8',
        date: '2026-07-16T10:30:00-07:00',
        updatedBy: 'Staff Kumar',
        status: 'Ready',
        remarks: 'Laptop tested thoroughly. All keys working. Charging and battery cycles checked. Marked ready for pickup.',
      }
    ]
  },
  {
    id: 'SLR-1004',
    customerName: 'Sanjay Dutt',
    phone: '9555667788',
    brand: 'Lenovo',
    model: 'ThinkPad T14 Gen 2',
    serialNumber: 'PF2K8X9Y',
    complaint: 'RAM upgrade from 8GB to 16GB. SSD upgrade to 1TB NVMe.',
    accessories: 'Laptop only',
    amount: 5500,
    advance: 5500,
    balance: 0,
    status: 'Delivered',
    deliveryDate: getPastDateString(1).split('T')[0],
    createdAt: getPastDateString(5),
    updatedAt: getPastDateString(1),
    paymentHistory: [
      {
        id: 'PAY-3',
        date: getPastDateString(5),
        amount: 3000,
        type: 'Advance',
        receivedBy: 'Staff Priya',
      },
      {
        id: 'PAY-4',
        date: getPastDateString(1),
        amount: 2500,
        type: 'Final',
        receivedBy: 'SLR Admin',
      }
    ],
    complaintHistory: [
      {
        id: 'HIST-9',
        date: getPastDateString(5),
        updatedBy: 'Staff Priya',
        status: 'Pending',
        remarks: 'Customer paid 3000 advance. Parts in stock.',
      },
      {
        id: 'HIST-10',
        date: getPastDateString(3),
        updatedBy: 'Staff Priya',
        status: 'Repairing',
        remarks: 'Installed 8GB Crucial DDR4 RAM and 1TB Kingston NVMe SSD. Cloned OS partition successfully.',
      },
      {
        id: 'HIST-11',
        date: getPastDateString(2),
        updatedBy: 'Staff Priya',
        status: 'Ready',
        remarks: 'Performance tests passed. CrystalDiskMark showing 3200MB/s speeds. Ready.',
      },
      {
        id: 'HIST-12',
        date: getPastDateString(1),
        updatedBy: 'SLR Admin',
        status: 'Delivered',
        remarks: 'Delivered to customer. Final payment of 2500 collected. Warranty explained.',
      }
    ]
  },
  {
    id: 'SLR-1005',
    customerName: 'Kiran Reddy',
    phone: '8765432109',
    brand: 'Asus',
    model: 'ROG Strix G15',
    serialNumber: 'H7N0CV056891',
    complaint: 'Display flickering and blanking out intermittently.',
    accessories: 'Power Brick, Original Box',
    amount: 8500,
    advance: 2000,
    balance: 6500,
    status: 'Pending',
    deliveryDate: getFutureDateString(3),
    createdAt: '2026-07-16T09:15:00-07:00', // Today morning
    updatedAt: '2026-07-16T09:15:00-07:00',
    paymentHistory: [
      {
        id: 'PAY-5',
        date: '2026-07-16T09:15:00-07:00',
        amount: 2000,
        type: 'Advance',
        receivedBy: 'Staff Kumar',
      }
    ],
    complaintHistory: [
      {
        id: 'HIST-13',
        date: '2026-07-16T09:15:00-07:00',
        updatedBy: 'Staff Kumar',
        status: 'Pending',
        remarks: 'Logged display issue. Looks like display cable damage or EDP connector loose.',
      }
    ]
  }
];
