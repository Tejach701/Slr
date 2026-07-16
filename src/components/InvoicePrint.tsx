/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wrench, Printer, ArrowLeft, Check } from 'lucide-react';
import { CustomerJob } from '../types';
import { formatINR, formatDateTime, formatFriendlyDate } from '../utils/helpers';

interface InvoicePrintProps {
  job: CustomerJob;
  onBack: () => void;
}

export const InvoicePrint: React.FC<InvoicePrintProps> = ({ job, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action panel (hidden during printing) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            id="invoice-back-btn"
            onClick={onBack}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-3xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h3 className="font-sans text-md font-bold text-slate-900">Generate Job Receipt</h3>
            <p className="text-[11px] text-slate-500">Preview of printable service invoice and ledger status</p>
          </div>
        </div>
        
        <button
          id="invoice-trigger-print-btn"
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Printer className="h-4 w-4" />
          Open Browser Print Dialog
        </button>
      </div>

      {/* Invoice Document Wrapper */}
      <div 
        id="invoice-document"
        className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-10 shadow-xs print:border-0 print:p-0 print:shadow-none"
      >
        {/* Document Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white print:bg-slate-900 print:text-white">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-950 uppercase tracking-tight">SLR TECH HUB</h2>
              <p className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wide print:text-slate-500">Premium Laptop Repair Hub</p>
            </div>
          </div>

          {/* Service Details */}
          <div className="text-left sm:text-right font-mono text-[11px] text-slate-500 space-y-1">
            <h1 className="font-sans text-lg font-black text-slate-900 print:text-slate-950 tracking-tight uppercase">RECEIPT / INVOICE</h1>
            <p><span className="font-bold text-slate-700">Receipt ID:</span> <span className="text-indigo-600 font-bold">{job.id}</span></p>
            <p><span className="font-bold text-slate-700">Service Date:</span> {formatFriendlyDate(job.createdAt.split('T')[0])}</p>
            <p><span className="font-bold text-slate-700">Due Date:</span> {formatFriendlyDate(job.deliveryDate)}</p>
          </div>
        </div>

        {/* Client & Vendor details row */}
        <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 border-b border-slate-100">
          {/* Vendor info */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wide">SERVICED BY:</span>
            <p className="text-xs font-extrabold text-slate-900">SLR TECH HUB</p>
            <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
              Plot 45, Tech Zone Road, Near City Center<br />
              Ph: +91 99001 99002 | Email: support@slrtechhub.com<br />
              GSTIN: 29AAAAA1111A1Z1
            </p>
          </div>

          {/* Client info */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wide">BILL TO:</span>
            <p className="text-xs font-extrabold text-slate-900">{job.customerName}</p>
            <p className="text-[11px] text-slate-500 font-mono leading-relaxed">
              Mobile: +91 {job.phone}<br />
              Laptop Model: {job.brand} {job.model}<br />
              S/N: {job.serialNumber}
            </p>
          </div>
        </div>

        {/* Itemized diagnostics and cost list */}
        <div className="py-8">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] pb-2 font-bold">
                <th className="py-2">Description of Services & Diagnostics</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Estimated Cost (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4">
                  <p className="font-sans font-bold text-slate-900">Laptop Service Ticket ({job.brand} {job.model})</p>
                  <p className="mt-1 text-[11px] text-slate-500 leading-normal max-w-md">
                    <span className="font-bold text-slate-700 font-mono">Complaint Logged:</span> {job.complaint}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    <span className="font-bold text-slate-600 font-mono">Accessories:</span> {job.accessories}
                  </p>
                </td>
                <td className="py-4 text-right text-slate-600">1</td>
                <td className="py-4 text-right font-bold text-slate-900">{formatINR(job.amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculation summary aligned block */}
        <div className="flex flex-col items-end gap-1.5 border-t border-slate-100 pt-6">
          <div className="w-full max-w-xs space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Gross Estimate Total:</span>
              <span>{formatINR(job.amount)}</span>
            </div>
            
            {/* Display list of deposits */}
            {job.paymentHistory.map((pay, i) => (
              <div key={pay.id} className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>• Deposit ({pay.type} - {formatFriendlyDate(pay.date.split('T')[0])}):</span>
                <span className="text-emerald-700">- {formatINR(pay.amount)}</span>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-slate-100 pt-2 font-sans font-extrabold text-slate-900 text-sm">
              <span>Balance to Pay:</span>
              <span className={job.balance > 0 ? 'text-rose-700 font-mono' : 'text-emerald-700 font-mono'}>
                {job.balance > 0 ? formatINR(job.balance) : '₹0 (Settled)'}
              </span>
            </div>
          </div>
        </div>

        {/* Signature & T&C block */}
        <div className="mt-12 grid grid-cols-1 gap-8 pt-8 border-t border-slate-100 sm:grid-cols-2 text-[10px] font-mono text-slate-400">
          <div className="space-y-1.5 leading-relaxed">
            <span className="font-bold text-slate-600">Terms & Service Conditions:</span>
            <p>1. Warranty applies strictly to hardware parts replaced, as specified in the warranty log.</p>
            <p>2. SLR TECH HUB is not responsible for any software data loss. Customers are advised to back up before hand-over.</p>
            <p>3. Devices left unclaimed for more than 45 days after the Ready notice will be subject to storage fees.</p>
          </div>
          
          {/* Signature lines */}
          <div className="flex flex-col justify-end items-end gap-1 text-right mt-6 sm:mt-0">
            <div className="h-10 w-32 border-b border-slate-300 print:border-slate-400" />
            <span className="font-bold text-slate-600">Authorized SLR Signatory</span>
            <span>Date: ________________</span>
          </div>
        </div>
      </div>
    </div>
  );
};
