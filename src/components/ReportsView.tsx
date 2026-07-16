/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BarChart2, 
  TrendingUp, 
  Calendar,
  Search,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { CustomerJob } from '../types';
import { formatINR, formatFriendlyDate, getWhatsAppLink } from '../utils/helpers';

interface ReportsViewProps {
  jobs: CustomerJob[];
  onViewDetails: (job: CustomerJob) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ jobs, onViewDetails }) => {
  const anchorDateStr = '2026-07-16'; // Anchor date of the app
  const anchorDate = new Date('2026-07-16T12:00:00-07:00');

  // Calculate reports data dynamically
  const reportsData = useMemo(() => {
    let dailyRevenue = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;

    let pendingJobsCount = 0;
    let completedJobsCount = 0;
    let pendingPaymentsCount = 0;
    let totalPendingPaymentsAmt = 0;

    const oneDayMs = 24 * 60 * 60 * 1000;

    jobs.forEach(job => {
      // Job status counts
      if (job.status !== 'Delivered') {
        pendingJobsCount++;
        if (job.balance > 0) {
          totalPendingPaymentsAmt += job.balance;
          pendingPaymentsCount++;
        }
      } else {
        completedJobsCount++;
      }

      // Read payment history
      job.paymentHistory.forEach(pay => {
        const payDate = new Date(pay.date);
        const diffMs = anchorDate.getTime() - payDate.getTime();
        const diffDays = diffMs / oneDayMs;

        // Daily (matching 2026-07-16)
        if (pay.date.split('T')[0] === anchorDateStr) {
          dailyRevenue += pay.amount;
        }

        // Weekly (past 7 days)
        if (diffDays >= 0 && diffDays <= 7) {
          weeklyRevenue += pay.amount;
        }

        // Monthly (past 30 days)
        if (diffDays >= 0 && diffDays <= 30) {
          monthlyRevenue += pay.amount;
        }
      });
    });

    return {
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      pendingJobsCount,
      completedJobsCount,
      pendingPaymentsCount,
      totalPendingPaymentsAmt
    };
  }, [jobs]);

  // Dynamic past 5 days revenue trend dataset for SVG graph
  const revenueTrend = useMemo(() => {
    const days = [4, 3, 2, 1, 0].map(daysAgo => {
      const d = new Date(anchorDate.getTime());
      d.setDate(d.getDate() - daysAgo);
      const dateStr = d.toISOString().split('T')[0];
      
      // Calculate revenue collected on this dateStr
      let rev = 0;
      jobs.forEach(job => {
        job.paymentHistory.forEach(p => {
          if (p.date.split('T')[0] === dateStr) {
            rev += p.amount;
          }
        });
      });

      // Label as 'Jul 12', 'Jul 13', etc.
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return { label, amount: rev };
    });

    return days;
  }, [jobs]);

  // Max value for bar scaling
  const maxRevenueVal = useMemo(() => {
    const vals = revenueTrend.map(d => d.amount);
    const m = Math.max(...vals);
    return m > 0 ? m : 5000;
  }, [revenueTrend]);

  // List of jobs with outstanding payments
  const outstandingJobs = useMemo(() => {
    return jobs
      .filter(j => j.balance > 0 && j.status !== 'Delivered')
      .sort((a, b) => b.balance - a.balance);
  }, [jobs]);

  return (
    <div className="space-y-6">
      {/* KPI stats section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Daily Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Today's Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-xl font-extrabold text-slate-950">{formatINR(reportsData.dailyRevenue)}</span>
            <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase">Jul 16 Receipts</p>
          </div>
        </div>

        {/* Weekly Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Weekly Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-xl font-extrabold text-slate-950">{formatINR(reportsData.weeklyRevenue)}</span>
            <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase">Past 7 Days Deposits</p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Monthly Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-xl font-extrabold text-slate-950">{formatINR(reportsData.monthlyRevenue)}</span>
            <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase">Past 30 Days Deposits</p>
          </div>
        </div>

        {/* Total Outstanding */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Pending Balance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-xl font-extrabold text-rose-700">{formatINR(reportsData.totalPendingPaymentsAmt)}</span>
            <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase">{reportsData.pendingPaymentsCount} Unpaid Invoices</p>
          </div>
        </div>
      </div>

      {/* Grid: Trend Bar Chart (8 cols) & Outstanding customers details (4 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Revenue Trend SVG Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="font-sans text-sm font-bold text-slate-900 tracking-tight">Revenue Receipt Velocity</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Deposit intake trend for the past 5 operational days</p>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
              <BarChart2 className="h-3.5 w-3.5 text-blue-500" />
              INR RECEIPTS
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="mt-8 flex h-60 items-end gap-6 px-4">
            {revenueTrend.map((day, idx) => {
              const heightPercent = maxRevenueVal > 0 ? (day.amount / maxRevenueVal) * 80 + 10 : 10;
              return (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2.5 h-full justify-end">
                  {/* Tooltip detail amount */}
                  <div className="font-mono text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded transition-transform group-hover:scale-105">
                    {day.amount > 0 ? formatINR(day.amount) : '₹0'}
                  </div>
                  {/* Visual Bar */}
                  <div 
                    className="w-full max-w-[48px] rounded-t-lg bg-blue-600 transition-all duration-700 hover:bg-blue-700 hover:shadow-xs shadow-3xs"
                    style={{ height: `${heightPercent}%` }}
                  />
                  {/* Day label */}
                  <span className="font-mono text-[10px] font-bold text-slate-500 tracking-tight mt-1">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini stats cards ring */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-sans text-sm font-bold text-slate-900 tracking-tight">Workstation Pipeline Stats</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-4">Servicing logs distribution metrics</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 space-y-1">
              <span className="font-mono text-[10px] font-bold text-slate-500">ACTIVE TICKETS</span>
              <p className="font-sans text-2xl font-black text-slate-900">{reportsData.pendingJobsCount}</p>
              <p className="text-[9px] font-mono text-amber-600 font-semibold uppercase">Checking/Repairing</p>
            </div>
            
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 space-y-1">
              <span className="font-mono text-[10px] font-bold text-slate-500">ARCHIVED (DELIVERED)</span>
              <p className="font-sans text-2xl font-black text-slate-900">{reportsData.completedJobsCount}</p>
              <p className="text-[9px] font-mono text-slate-500 font-semibold uppercase">Delivered safely</p>
            </div>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50/20 p-4 space-y-1 mt-4">
            <span className="font-mono text-[10px] font-bold text-blue-950 uppercase">Estimated Recovery Ratio</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-lg font-bold text-blue-700">
                {formatINR(reportsData.totalPendingPaymentsAmt)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">IN OUTSTANDING BACKLOG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Balances ledger table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h4 className="font-sans text-sm font-bold text-slate-900 tracking-tight">Outstanding Customer Ledger</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Active laptop service accounts with non-zero balance payments</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-2.5">Ticket ID</th>
                <th className="py-2.5">Customer Name</th>
                <th className="py-2.5">Device Description</th>
                <th className="py-2.5 text-right font-mono">Outstanding Balance</th>
                <th className="py-2.5 text-right font-mono">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {outstandingJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center font-mono text-xs text-slate-400">
                    No active balances! All registered laptops are paid in full. ✅
                  </td>
                </tr>
              ) : (
                outstandingJobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-slate-50/50">
                    <td className="py-3 font-mono text-xs font-bold text-blue-600">{job.id}</td>
                    <td className="py-3 font-semibold text-slate-950">
                      {job.customerName}
                      <p className="text-[10px] font-mono font-medium text-slate-500 mt-0.5">{job.phone}</p>
                    </td>
                    <td className="py-3 text-slate-700 font-medium">{job.brand} {job.model}</td>
                    <td className="py-3 text-right font-mono font-extrabold text-rose-700">{formatINR(job.balance)}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {/* WhatsApp reminder trigger */}
                        <a
                          id={`whatsapp-reminder-${job.id}`}
                          href={getWhatsAppLink(job)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Send WhatsApp payment reminder"
                          className="inline-flex h-7 px-2.5 items-center justify-center gap-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-mono text-[10px] font-bold border border-emerald-200"
                        >
                          <Smartphone className="h-3 w-3 shrink-0" />
                          REMIND
                        </a>
                        {/* Open details */}
                        <button
                          id={`outstanding-view-${job.id}`}
                          onClick={() => onViewDetails(job)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
