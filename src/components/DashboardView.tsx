/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Laptop, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Plus,
  Users,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { CustomerJob, JobStatus } from '../types';
import { formatINR, calculateSystemStats } from '../utils/helpers';

interface DashboardViewProps {
  jobs: CustomerJob[];
  setActiveTab: (tab: string) => void;
  onViewJobDetails: (job: CustomerJob) => void;
  onRegisterNew: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  jobs,
  setActiveTab,
  onViewJobDetails,
  onRegisterNew
}) => {
  const stats = calculateSystemStats(jobs);

  // Status counters
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<JobStatus, number>);

  const statuses: { label: JobStatus; color: string; bg: string }[] = [
    { label: 'Pending', color: 'text-rose-700 border-rose-200 bg-rose-50', bg: 'bg-rose-500' },
    { label: 'Checking', color: 'text-amber-700 border-amber-200 bg-amber-50', bg: 'bg-amber-500' },
    { label: 'Repairing', color: 'text-blue-700 border-blue-200 bg-blue-50', bg: 'bg-blue-500' },
    { label: 'Waiting for Parts', color: 'text-purple-700 border-purple-200 bg-purple-50', bg: 'bg-purple-500' },
    { label: 'Ready', color: 'text-emerald-700 border-emerald-200 bg-emerald-50', bg: 'bg-emerald-500' },
    { label: 'Delivered', color: 'text-slate-700 border-slate-200 bg-slate-50', bg: 'bg-slate-500' },
  ];

  // Latest 4 customers added
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Card */}
      <div className="flex flex-col gap-4 rounded-2xl bg-linear-to-r from-blue-900 to-slate-900 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-sans text-xl font-bold tracking-tight">SLR TECH HUB Workshop Management</h3>
          <p className="mt-1 text-xs text-blue-200 font-medium">
            Realtime tracker for laptop servicing, repairs, invoices, and payments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            id="dash-quick-register"
            onClick={onRegisterNew}
            className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-blue-950 hover:bg-blue-50 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            New Service Entry
          </button>
          <button
            id="dash-view-all"
            onClick={() => setActiveTab('jobs')}
            className="flex items-center gap-1.5 rounded-xl bg-blue-800/60 border border-blue-700 px-4 py-2 text-xs font-semibold text-blue-100 hover:bg-blue-800 transition-all"
          >
            <FileSpreadsheet className="h-4 w-4" />
            View Job Database
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1: Today's Intake */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Today's Jobs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Laptop className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sans text-2xl font-extrabold tracking-tight text-slate-950">{stats.todayJobsCount}</span>
            <span className="text-[10px] font-mono font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">NEW INTAKE</span>
          </div>
        </div>

        {/* KPI 2: Pending Repairs */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Pending Jobs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sans text-2xl font-extrabold tracking-tight text-slate-950">{stats.pendingJobsCount}</span>
            <span className="text-[10px] font-mono font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">ACTIVE</span>
          </div>
        </div>

        {/* KPI 3: Completed Repairs */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Completed Jobs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sans text-2xl font-extrabold tracking-tight text-slate-950">{stats.completedJobsCount}</span>
            <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">DELIVERABLE</span>
          </div>
        </div>

        {/* KPI 4: Total Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Revenue Collected</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-lg font-bold tracking-tight text-emerald-700">{formatINR(stats.totalRevenue)}</span>
            <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase">NET DEPOSITS</p>
          </div>
        </div>

        {/* KPI 5: Pending Balance */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Pending Amount</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-lg font-bold tracking-tight text-rose-700">{formatINR(stats.pendingRevenue)}</span>
            <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase">OUTSTANDING</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Status Distribution & Recent customers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Status Breakdown card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-4">
          <h4 className="font-sans text-sm font-bold text-slate-900 tracking-tight">Workstation Load</h4>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-5">Job allocation by repair stages</p>

          <div className="space-y-4">
            {statuses.map(status => {
              const count = statusCounts[status.label] || 0;
              const percent = jobs.length > 0 ? (count / jobs.length) * 100 : 0;
              return (
                <div key={status.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700">{status.label}</span>
                    <span className="font-mono text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${status.bg} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
              TOTAL REPAIRS LOGGED:
            </div>
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{jobs.length} Devices</span>
          </div>
        </div>

        {/* Recent Customers list */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="font-sans text-sm font-bold text-slate-900 tracking-tight">Recent Laptop Intakes</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Most recent jobs logged into SLR TECH HUB</p>
            </div>
            <button
              id="view-all-jobs-btn"
              onClick={() => setActiveTab('jobs')}
              className="flex items-center gap-1 font-mono text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              All Jobs
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-mono text-slate-500 uppercase">
                  <th className="py-2.5">Job ID</th>
                  <th className="py-2.5">Customer / Model</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Balance Due</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center font-mono text-xs text-slate-400">
                      No customer jobs found. Register your first laptop above!
                    </td>
                  </tr>
                ) : (
                  recentJobs.map(job => {
                    const statusTheme = statuses.find(s => s.label === job.status) || { color: 'text-slate-700 border-slate-200 bg-slate-50' };
                    return (
                      <tr key={job.id} className="group hover:bg-slate-50/50">
                        {/* Job ID */}
                        <td className="py-3 font-mono text-xs font-bold text-blue-600">
                          {job.id}
                        </td>
                        {/* Customer & Laptop */}
                        <td className="py-3">
                          <p className="text-xs font-semibold text-slate-900">{job.customerName}</p>
                          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                            {job.brand} <span className="text-slate-400">({job.model})</span>
                          </p>
                        </td>
                        {/* Status badge */}
                        <td className="py-3 text-center">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[9px] font-bold border ${statusTheme.color}`}>
                            {job.status}
                          </span>
                        </td>
                        {/* Balance to pay */}
                        <td className="py-3 text-right font-mono text-xs font-bold text-slate-700">
                          {job.balance > 0 ? formatINR(job.balance) : <span className="text-emerald-600 text-[10px] uppercase font-bold">Paid</span>}
                        </td>
                        {/* Action details button */}
                        <td className="py-3 text-right">
                          <button
                            id={`dash-view-job-${job.id}`}
                            onClick={() => onViewJobDetails(job)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-200"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
