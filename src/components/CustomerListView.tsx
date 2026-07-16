/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  Laptop,
  CheckCircle,
  Clock,
  TrendingUp,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { CustomerJob, JobStatus } from '../types';
import { formatINR, formatFriendlyDate } from '../utils/helpers';

interface CustomerListViewProps {
  jobs: CustomerJob[];
  onViewDetails: (job: CustomerJob) => void;
  onEdit: (job: CustomerJob) => void;
  onDelete: (id: string) => void;
}

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  jobs,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All'); // 'All', 'Pending Balance', 'Fully Paid'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Status themes
  const statuses: { label: JobStatus; color: string }[] = [
    { label: 'Pending', color: 'text-rose-700 border-rose-200 bg-rose-50' },
    { label: 'Checking', color: 'text-amber-700 border-amber-200 bg-amber-50' },
    { label: 'Repairing', color: 'text-blue-700 border-blue-200 bg-blue-50' },
    { label: 'Waiting for Parts', color: 'text-purple-700 border-purple-200 bg-purple-50' },
    { label: 'Ready', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
    { label: 'Delivered', color: 'text-slate-700 border-slate-200 bg-slate-50' },
  ];

  // Extract all brands for filter dropdown
  const uniqueBrands = useMemo(() => {
    const brands = jobs.map(j => j.brand);
    return ['All', ...Array.from(new Set(brands))];
  }, [jobs]);

  // Filter & Search Logic
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by Search term
    if (searchTerm.trim() !== '') {
      const s = searchTerm.toLowerCase().trim();
      result = result.filter(job => 
        job.customerName.toLowerCase().includes(s) ||
        job.phone.includes(s) ||
        job.id.toLowerCase().includes(s) ||
        job.brand.toLowerCase().includes(s) ||
        job.model.toLowerCase().includes(s) ||
        job.serialNumber.toLowerCase().includes(s)
      );
    }

    // Filter by Status
    if (statusFilter !== 'All') {
      result = result.filter(job => job.status === statusFilter);
    }

    // Filter by Brand
    if (brandFilter !== 'All') {
      result = result.filter(job => job.brand.toLowerCase() === brandFilter.toLowerCase());
    }

    // Filter by Payment status
    if (paymentFilter === 'Pending Balance') {
      result = result.filter(job => job.balance > 0);
    } else if (paymentFilter === 'Fully Paid') {
      result = result.filter(job => job.balance === 0);
    }

    // Sort: newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [jobs, searchTerm, statusFilter, brandFilter, paymentFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setBrandFilter('All');
    setPaymentFilter('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search bar */}
          <div className="relative flex-1 rounded-lg shadow-3xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              id="list-search-input"
              type="text"
              placeholder="Search by Job ID, name, phone, laptop brand..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Clear Filter indicator */}
          {(statusFilter !== 'All' || brandFilter !== 'All' || paymentFilter !== 'All' || searchTerm !== '') && (
            <button
              onClick={resetFilters}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-all shadow-3xs flex items-center gap-1"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2 border-t border-slate-50">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Filter Status</label>
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Checking">Checking</option>
              <option value="Repairing">Repairing</option>
              <option value="Waiting for Parts">Waiting for Parts</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Filter Laptop Brand</label>
            <select
              id="filter-brand-select"
              value={brandFilter}
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Brands</option>
              {uniqueBrands.filter(b => b !== 'All').map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Filter Ledger Balance</label>
            <select
              id="filter-payment-select"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Payments</option>
              <option value="Pending Balance">Has Pending Balance</option>
              <option value="Fully Paid">Fully Settled (Paid)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List Display Grid */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Table for Desktop & tablet */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Ticket ID</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Laptop Specification</th>
                <th className="py-3 px-4 text-center">Workstation Status</th>
                <th className="py-3 px-4 text-right">Ledger Pricing</th>
                <th className="py-3 px-4 text-right">Target Date</th>
                <th className="py-3 px-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center font-mono text-xs text-slate-400">
                    No repair entries match your current search constraints.
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => {
                  const statusTheme = statuses.find(s => s.label === job.status) || { color: 'text-slate-700 border-slate-200 bg-slate-50' };
                  return (
                    <tr key={job.id} className="group hover:bg-slate-50/40">
                      {/* Ticket ID */}
                      <td className="py-3.5 px-5 font-mono text-xs font-bold text-blue-600">
                        {job.id}
                      </td>
                      {/* Customer info */}
                      <td className="py-3.5 px-4">
                        <p className="text-xs font-semibold text-slate-900">{job.customerName}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">{job.phone}</p>
                      </td>
                      {/* Laptop Specification */}
                      <td className="py-3.5 px-4">
                        <p className="text-xs font-semibold text-slate-900">
                          {job.brand} <span className="text-slate-500 font-normal">{job.model}</span>
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-[180px]">
                          S/N: {job.serialNumber}
                        </p>
                      </td>
                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[9px] font-bold border ${statusTheme.color}`}>
                          {job.status}
                        </span>
                      </td>
                      {/* Pricing summary */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="text-xs font-bold text-slate-900">Est: {formatINR(job.amount)}</div>
                        <div className={`text-[10px] mt-0.5 font-bold ${job.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {job.balance > 0 ? `Bal: ${formatINR(job.balance)}` : 'Settle Paid'}
                        </div>
                      </td>
                      {/* Target Delivery Date */}
                      <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-600">
                        {formatFriendlyDate(job.deliveryDate)}
                      </td>
                      {/* Operations */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex justify-end gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
                          {/* View details */}
                          <button
                            id={`list-view-${job.id}`}
                            onClick={() => onViewDetails(job)}
                            title="Diagnostics & Invoice"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {/* Edit */}
                          <button
                            id={`list-edit-${job.id}`}
                            onClick={() => onEdit(job)}
                            title="Edit Service Entry"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          {/* Delete */}
                          <button
                            id={`list-delete-${job.id}`}
                            onClick={() => {
                              if (window.confirm(`Are you absolutely sure you want to delete ${job.customerName}'s service entry (${job.id})? This is non-reversible.`)) {
                                onDelete(job.id);
                              }
                            }}
                            title="Delete Ledger Entry"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Card Stack for Mobile UI */}
        <div className="block md:hidden divide-y divide-slate-100">
          {paginatedJobs.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-slate-400">
              No repair entries match your current filters.
            </div>
          ) : (
            paginatedJobs.map((job) => {
              const statusTheme = statuses.find(s => s.label === job.status) || { color: 'text-slate-700 border-slate-200 bg-slate-50' };
              return (
                <div key={job.id} className="p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600">{job.id}</span>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[9px] font-bold border ${statusTheme.color}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">{job.customerName}</h4>
                    <p className="text-[10px] font-mono text-slate-500">{job.phone}</p>
                    <p className="text-xs text-slate-700 font-medium">{job.brand} {job.model}</p>
                    <p className="text-[10px] font-mono text-slate-400">Complaint: {job.complaint.substring(0, 50)}...</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                    <div className="font-mono text-[10px]">
                      <span className="text-slate-400">Bal Due: </span>
                      <span className={`font-bold ${job.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {job.balance > 0 ? formatINR(job.balance) : 'Paid'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(job)}
                        className="rounded-lg bg-blue-50 px-2.5 py-1.5 font-mono text-[10px] font-bold text-blue-600"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onEdit(job)}
                        className="rounded-lg bg-slate-50 border border-slate-200 p-1.5 text-slate-600"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you absolutely sure you want to delete ${job.customerName}'s service entry (${job.id})?`)) {
                            onDelete(job.id);
                          }
                        }}
                        className="rounded-lg bg-slate-50 border border-slate-200 p-1.5 text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-5 py-3.5">
          <div className="text-xs font-medium text-slate-500 font-mono">
            Showing {filteredJobs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} tickets
          </div>
          <div className="flex items-center gap-1">
            <button
              id="list-prev-page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 shadow-3xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 font-mono shadow-3xs">
              {currentPage} / {totalPages}
            </div>
            <button
              id="list-next-page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 shadow-3xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
