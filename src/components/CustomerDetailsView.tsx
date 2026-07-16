/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Smartphone, 
  Laptop, 
  Calendar, 
  AlertCircle,
  Clock,
  History,
  CreditCard,
  MessageSquare,
  Printer,
  ChevronRight,
  Send,
  Plus,
  RefreshCw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { CustomerJob, JobStatus, PaymentRecord, HistoryRecord } from '../types';
import { formatINR, formatDateTime, formatFriendlyDate, getWhatsAppLink } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

interface CustomerDetailsViewProps {
  job: CustomerJob;
  onBack: () => void;
  onUpdateJob: (updatedJob: CustomerJob) => void;
  onPrintInvoice: () => void;
}

export const CustomerDetailsView: React.FC<CustomerDetailsViewProps> = ({
  job,
  onBack,
  onUpdateJob,
  onPrintInvoice
}) => {
  const { currentUser } = useAuth();
  
  // Local active status update states
  const [statusInput, setStatusInput] = useState<JobStatus>(job.status);
  const [remarksInput, setRemarksInput] = useState('');
  
  // Local payment collection states
  const [payAmountInput, setPayAmountInput] = useState<number>(0);
  const [payTypeInput, setPayTypeInput] = useState<'Interim' | 'Final'>('Interim');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  const [statusSuccessMsg, setStatusSuccessMsg] = useState('');

  // Status list
  const statuses: JobStatus[] = ['Pending', 'Checking', 'Repairing', 'Waiting for Parts', 'Ready', 'Delivered'];
  
  const statusColors: Record<JobStatus, string> = {
    'Pending': 'text-rose-700 bg-rose-50 border-rose-100',
    'Checking': 'text-amber-700 bg-amber-50 border-amber-100',
    'Repairing': 'text-blue-700 bg-blue-50 border-blue-100',
    'Waiting for Parts': 'text-purple-700 bg-purple-50 border-purple-100',
    'Ready': 'text-emerald-700 bg-emerald-50 border-emerald-100',
    'Delivered': 'text-slate-700 bg-slate-50 border-slate-100',
  };

  // Status transitions or remarks logger
  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusSuccessMsg('');

    const newHistoryRecord: HistoryRecord = {
      id: 'HIST-' + Date.now(),
      date: new Date().toISOString(),
      updatedBy: currentUser ? currentUser.name : 'System',
      status: statusInput,
      remarks: remarksInput.trim() || `Status updated to ${statusInput}`
    };

    const updatedJob: CustomerJob = {
      ...job,
      status: statusInput,
      updatedAt: new Date().toISOString(),
      complaintHistory: [newHistoryRecord, ...job.complaintHistory]
    };

    onUpdateJob(updatedJob);
    setRemarksInput('');
    setStatusSuccessMsg('Status updated successfully!');
    setTimeout(() => setStatusSuccessMsg(''), 3000);
  };

  // Payment addition logger
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccessMsg('');

    if (payAmountInput <= 0) return;
    if (payAmountInput > job.balance) {
      alert(`Payment cannot exceed outstanding balance of ${formatINR(job.balance)}`);
      return;
    }

    const newPaymentRecord: PaymentRecord = {
      id: 'PAY-' + Date.now(),
      date: new Date().toISOString(),
      amount: payAmountInput,
      type: payTypeInput,
      receivedBy: currentUser ? currentUser.name : 'System'
    };

    const newHistoryRecord: HistoryRecord = {
      id: 'HIST-' + Date.now(),
      date: new Date().toISOString(),
      updatedBy: currentUser ? currentUser.name : 'System',
      status: job.status,
      remarks: `Collected payment of ${formatINR(payAmountInput)} (${payTypeInput})`
    };

    const newAdvance = job.advance + payAmountInput;
    const newBalance = Math.max(0, job.amount - newAdvance);

    const updatedJob: CustomerJob = {
      ...job,
      advance: newAdvance,
      balance: newBalance,
      updatedAt: new Date().toISOString(),
      paymentHistory: [...job.paymentHistory, newPaymentRecord],
      complaintHistory: [newHistoryRecord, ...job.complaintHistory]
    };

    onUpdateJob(updatedJob);
    setPayAmountInput(0);
    setPaymentSuccessMsg('Payment logged successfully!');
    setTimeout(() => setPaymentSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Back button row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            id="details-back-btn"
            onClick={onBack}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-3xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h3 className="font-sans text-md font-bold text-slate-900">
              Details for Job Ticket: <span className="text-blue-600 font-mono font-bold">{job.id}</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Registered on {formatDateTime(job.createdAt)}
            </p>
          </div>
        </div>

        {/* Action triggers: WhatsApp notification & Print Receipt */}
        <div className="flex flex-wrap gap-2">
          {/* Print Invoice */}
          <button
            id="details-print-invoice-btn"
            onClick={onPrintInvoice}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-3xs"
          >
            <Printer className="h-4 w-4 text-blue-500" />
            Print Invoice
          </button>

          {/* Send WhatsApp notification (Always free & robust) */}
          <a
            id="details-whatsapp-notification-link"
            href={getWhatsAppLink(job)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-all shadow-sm"
          >
            <Smartphone className="h-4 w-4" />
            WhatsApp Customer
          </a>
        </div>
      </div>

      {/* Main Grid: Info Cards (7 cols) + Action forms (5 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Side: General Info & Timelines (8 cols) */}
        <div className="space-y-6 lg:col-span-7">
          
          {/* Customer & Laptop specs details */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Job Overview Details
              </h4>
              <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-mono text-[10px] font-bold border ${statusColors[job.status]}`}>
                {job.status}
              </span>
            </div>

            {/* Layout details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Customer Name</span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  {job.customerName}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Phone Number</span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5 font-mono">
                  <Smartphone className="h-4 w-4 text-slate-400 shrink-0" />
                  {job.phone}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Laptop Brand & Model</span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Laptop className="h-4 w-4 text-slate-400 shrink-0" />
                  {job.brand} {job.model}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Serial Number (Tag)</span>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5 font-mono">
                  S/N: {job.serialNumber}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Estimated Delivery</span>
                <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {formatFriendlyDate(job.deliveryDate)}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Accessories Left</span>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  {job.accessories}
                </p>
              </div>
            </div>

            {/* Complaint summary */}
            <div className="rounded-lg bg-slate-50 border border-slate-150 p-3.5 mt-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
                Reported Complaint / Issue
              </span>
              <p className="text-xs text-slate-950 font-medium mt-1.5 leading-relaxed">
                {job.complaint}
              </p>
            </div>
          </div>

          {/* Payment breakdown module */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 font-mono">
              Invoicing & Payment Details
            </h4>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-150 p-3.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Total Estimate</span>
                <p className="text-sm font-extrabold text-slate-900 mt-1 font-mono">
                  {formatINR(job.amount)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-150 p-3.5 bg-emerald-50/20">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Total Deposits</span>
                <p className="text-sm font-extrabold text-emerald-700 mt-1 font-mono">
                  {formatINR(job.advance)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-150 p-3.5 bg-rose-50/20">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Outstanding Balance</span>
                <p className="text-sm font-extrabold text-rose-700 mt-1 font-mono">
                  {formatINR(job.balance)}
                </p>
              </div>
            </div>

            {/* Payment updates logs */}
            <div className="pt-2">
              <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight mb-2">Deposit Audit Logs</h5>
              {job.paymentHistory.length === 0 ? (
                <p className="text-[10px] font-mono text-slate-400 italic">No payments logged yet for this repair ledger.</p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden bg-slate-50/30">
                  {job.paymentHistory.map((pay) => (
                    <div key={pay.id} className="flex items-center justify-between p-3 text-xs">
                      <div>
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[9px] mr-1.5">
                          {pay.type}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{formatDateTime(pay.date)}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Received by: {pay.receivedBy}</p>
                      </div>
                      <span className="font-mono font-extrabold text-emerald-700">
                        + {formatINR(pay.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* History Timeline of Repair Stages */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 font-mono flex items-center gap-1.5">
              <History className="h-4 w-4 text-slate-400" />
              Activity Logs & Timeline
            </h4>

            <div className="relative border-l border-slate-200 pl-4.5 ml-1.5 space-y-5 py-2">
              {job.complaintHistory.map((hist) => {
                const subColor = statusColors[hist.status] || 'text-slate-700 bg-slate-50 border-slate-100';
                return (
                  <div key={hist.id} className="relative">
                    {/* Pulsing indicator dot */}
                    <span className="absolute -left-[24px] top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white" />
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[8px] font-bold border ${subColor}`}>
                          {hist.status}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {formatDateTime(hist.date)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          by {hist.updatedBy}
                        </span>
                      </div>
                      <p className="text-xs text-slate-950 font-medium bg-slate-50/50 rounded-lg border border-slate-100 p-2.5">
                        {hist.remarks}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Quick update forms (4 cols) */}
        <div className="space-y-6 lg:col-span-5">
          
          {/* Form 1: Update Status */}
          {job.status !== 'Delivered' ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 font-mono">
                Log Status Remark
              </h4>

              {statusSuccessMsg && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {statusSuccessMsg}
                </div>
              )}

              <form onSubmit={handleUpdateStatus} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Select Active Stage</label>
                  <select
                    id="update-stage-select"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as JobStatus)}
                    className="block w-full rounded-lg border border-slate-200 bg-slate-50/30 py-2.5 px-3 font-mono text-xs text-slate-950 focus:border-blue-500 focus:outline-hidden"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Log Diagnostic Remarks</label>
                  <textarea
                    id="update-remarks-textarea"
                    rows={3}
                    required
                    placeholder="Enter diagnostic details, parts used, or client communication notes..."
                    value={remarksInput}
                    onChange={(e) => setRemarksInput(e.target.value)}
                    className="block w-full rounded-lg border border-slate-200 bg-slate-50/30 p-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  id="submit-status-remarks-btn"
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 font-mono text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  UPDATE SERVICE RECORD
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-5 shadow-xs flex flex-col items-center justify-center text-center space-y-2 py-8">
              <Lock className="h-8 w-8 text-slate-400" />
              <h5 className="font-sans text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">LOCKED TICKET</h5>
              <p className="text-[10px] font-mono text-slate-400 max-w-[200px]">
                This ticket has been marked DELIVERED and is locked from active workstation logs.
              </p>
            </div>
          )}

          {/* Form 2: Update Payment Balance */}
          {job.balance > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 font-mono">
                Collect Payment Deposit
              </h4>

              {paymentSuccessMsg && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {paymentSuccessMsg}
                </div>
              )}

              <form onSubmit={handleAddPayment} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Payment Classification</label>
                  <select
                    id="payment-classification-select"
                    value={payTypeInput}
                    onChange={(e) => setPayTypeInput(e.target.value as 'Interim' | 'Final')}
                    className="block w-full rounded-lg border border-slate-200 bg-slate-50/30 py-2.5 px-3 font-mono text-xs text-slate-950 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Interim">Interim Deposit (Partial)</option>
                    <option value="Final">Final Invoice Settlement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Amount Received (INR)</label>
                  <div className="relative rounded-lg shadow-3xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="font-mono text-xs font-bold">₹</span>
                    </div>
                    <input
                      id="collect-payment-amount-input"
                      type="number"
                      required
                      min={1}
                      max={job.balance}
                      placeholder={`Max: ${job.balance}`}
                      value={payAmountInput || ''}
                      onChange={(e) => setPayAmountInput(Number(e.target.value))}
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50/30 py-2.5 pl-8 pr-3 font-mono text-xs text-slate-950 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  id="submit-collect-payment-btn"
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2.5 font-mono text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-sm"
                >
                  <CreditCard className="h-4 w-4" />
                  COLLECT DEPOSIT
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-xs flex flex-col items-center justify-center text-center space-y-1.5 py-8">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <h5 className="font-sans text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">SETTLED IN FULL</h5>
              <p className="text-[10px] font-mono text-emerald-600">
                Outstanding balance is fully paid! No active invoices.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
