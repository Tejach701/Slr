/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  User, 
  Phone, 
  Hash, 
  HelpCircle, 
  Inbox, 
  DollarSign, 
  Calendar,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { CustomerJob, JobStatus } from '../types';
import { formatINR } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

interface CustomerFormProps {
  jobToEdit?: CustomerJob;
  onSave: (jobData: Partial<CustomerJob>) => void;
  onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  jobToEdit,
  onSave,
  onCancel
}) => {
  const { currentUser } = useAuth();
  
  // Local form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [complaint, setComplaint] = useState('');
  const [accessories, setAccessories] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [status, setStatus] = useState<JobStatus>('Pending');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Default suggestions for speed typing
  const brandSuggestions = ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'MSI', 'Samsung'];
  const accessorySuggestions = ['Charger', 'Laptop Bag', 'Wireless Mouse', 'Power Cord', 'Stylus Pen'];
  const complaintSuggestions = ['No Power', 'Flickering Screen', 'Overheating / Fan Noise', 'SSD Upgrade', 'Keyboard water damage', 'OS Corruption / Slow boot'];

  useEffect(() => {
    if (jobToEdit) {
      setCustomerName(jobToEdit.customerName);
      setPhone(jobToEdit.phone);
      setBrand(jobToEdit.brand);
      setModel(jobToEdit.model);
      setSerialNumber(jobToEdit.serialNumber);
      setComplaint(jobToEdit.complaint);
      setAccessories(jobToEdit.accessories);
      setAmount(jobToEdit.amount);
      setAdvance(jobToEdit.advance);
      setStatus(jobToEdit.status);
      setDeliveryDate(jobToEdit.deliveryDate);
    } else {
      // Set default delivery date 3 days from today (2026-07-16 -> 2026-07-19)
      setDeliveryDate('2026-07-19');
    }
  }, [jobToEdit]);

  // Handle auto-calculation of balance
  const balance = Math.max(0, amount - advance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field Validations
    if (!customerName.trim()) return setErrorMsg('Customer Name is required');
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) return setErrorMsg('Please enter a valid 10-digit Phone Number');
    if (!brand.trim()) return setErrorMsg('Laptop Brand is required');
    if (!model.trim()) return setErrorMsg('Laptop Model is required');
    if (!complaint.trim()) return setErrorMsg('Please detail the complaint or required service');
    if (amount < 0) return setErrorMsg('Estimated amount cannot be negative');
    if (advance < 0) return setErrorMsg('Advance paid cannot be negative');
    if (advance > amount) return setErrorMsg('Advance paid cannot exceed the estimated total amount');
    if (!deliveryDate) return setErrorMsg('Please set an estimated delivery date');

    onSave({
      customerName: customerName.trim(),
      phone: phone.replace(/\D/g, ''),
      brand: brand.trim(),
      model: model.trim(),
      serialNumber: serialNumber.trim() || 'N/A',
      complaint: complaint.trim(),
      accessories: accessories.trim() || 'No accessories',
      amount,
      advance,
      balance,
      status,
      deliveryDate
    });
  };

  const selectBrand = (selected: string) => setBrand(selected);
  const appendAccessory = (acc: string) => {
    setAccessories(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return acc;
      if (trimmed.toLowerCase().includes(acc.toLowerCase())) return prev;
      return `${trimmed}, ${acc}`;
    });
  };
  const setQuickComplaint = (comp: string) => setComplaint(comp);

  return (
    <div className="space-y-6">
      {/* Back button header */}
      <div className="flex items-center gap-3">
        <button
          id="form-back-btn"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-3xs"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h3 className="font-sans text-md font-bold text-slate-900">
            {jobToEdit ? `Edit Ticket ${jobToEdit.id}` : 'Register New Laptop Ticket'}
          </h3>
          <p className="text-[11px] text-slate-500">
            {jobToEdit ? 'Modify details, payment, or status attributes' : 'Create a new repair and invoicing ledger entry'}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div id="form-error-msg" className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-xs font-medium text-rose-800 shadow-3xs flex items-center gap-2">
          <HelpCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Main form card */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          
          {/* Section 1: Customer Info (6-columns) */}
          <div className="space-y-4 md:col-span-6">
            <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
              Customer Information
            </h4>
            
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Customer Name *</label>
              <div className="relative rounded-lg shadow-3xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="input-customer-name"
                  type="text"
                  required
                  placeholder="e.g. Anil Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Mobile Number *</label>
              <div className="relative rounded-lg shadow-3xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="input-phone"
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Laptop Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Laptop Brand *</label>
              <div className="relative rounded-lg shadow-3xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Laptop className="h-4 w-4" />
                </div>
                <input
                  id="input-brand"
                  type="text"
                  required
                  placeholder="e.g. Dell, HP, Apple"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>
              {/* Brand chips */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {brandSuggestions.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => selectBrand(b)}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Laptop Model */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Laptop Model *</label>
              <div className="relative rounded-lg shadow-3xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Laptop className="h-4 w-4" />
                </div>
                <input
                  id="input-model"
                  type="text"
                  required
                  placeholder="e.g. Inspiron 15 3000"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Serial / Service Tag Number</label>
              <div className="relative rounded-lg shadow-3xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Hash className="h-4 w-4" />
                </div>
                <input
                  id="input-serial"
                  type="text"
                  placeholder="e.g. CND0284X8L (or N/A)"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Service & Diagnosis (6-columns) */}
          <div className="space-y-4 md:col-span-6">
            <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
              Service Diagnosis & Accessories
            </h4>

            {/* Complaint */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Reported Complaint *</label>
              <textarea
                id="input-complaint"
                required
                rows={3}
                placeholder="Describe the diagnostics and issues reported by the customer..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden resize-none"
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {complaintSuggestions.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setQuickComplaint(c)}
                    className="rounded-md border border-slate-150 bg-slate-50 px-2 py-0.5 font-mono text-[9px] text-slate-500 hover:bg-slate-100 hover:text-slate-850"
                  >
                    + {c.length > 25 ? c.substring(0, 22) + '...' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Accessories Left Behind</label>
              <div className="relative rounded-lg shadow-3xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Inbox className="h-4 w-4" />
                </div>
                <input
                  id="input-accessories"
                  type="text"
                  placeholder="e.g. Charger, Laptop Box, Original Bag"
                  value={accessories}
                  onChange={(e) => setAccessories(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {accessorySuggestions.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => appendAccessory(a)}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    + {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Delivery Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Estimated Delivery Date *</label>
              <div className="relative rounded-lg shadow-3xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  id="input-delivery-date"
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 font-mono text-xs text-slate-950 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Status (Visible only during Edit) */}
            {jobToEdit && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Workstation Status</label>
                <select
                  id="input-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JobStatus)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 font-mono text-xs text-slate-950 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="Pending">Pending</option>
                  <option value="Checking">Checking</option>
                  <option value="Repairing">Repairing</option>
                  <option value="Waiting for Parts">Waiting for Parts</option>
                  <option value="Ready">Ready (For Delivery)</option>
                  <option value="Delivered">Delivered (Archived)</option>
                </select>
              </div>
            )}
          </div>

          {/* Section 3: Invoicing / Payments (12-columns bento block) */}
          <div className="md:col-span-12 mt-4">
            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5 space-y-4">
              <h4 className="font-sans text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Ledge Ledger & Initial Deposit
              </h4>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Total Estimate */}
                <div>
                  <label className="block text-xs font-bold text-blue-950 mb-1.5 font-mono">Estimated Amount (INR) *</label>
                  <div className="relative rounded-lg shadow-3xs bg-white">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="font-mono text-xs font-bold">₹</span>
                    </div>
                    <input
                      id="input-amount"
                      type="number"
                      min={0}
                      required
                      placeholder="0"
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="block w-full rounded-lg border border-slate-200 bg-transparent py-2.5 pl-8 pr-3 font-mono text-xs text-slate-950 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Advance Paid */}
                <div>
                  <label className="block text-xs font-bold text-blue-950 mb-1.5 font-mono">Advance Paid (INR)</label>
                  <div className="relative rounded-lg shadow-3xs bg-white">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="font-mono text-xs font-bold">₹</span>
                    </div>
                    <input
                      id="input-advance"
                      type="number"
                      min={0}
                      placeholder="0"
                      value={advance || ''}
                      onChange={(e) => setAdvance(Number(e.target.value))}
                      className="block w-full rounded-lg border border-slate-200 bg-transparent py-2.5 pl-8 pr-3 font-mono text-xs text-slate-950 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Balance Calculated */}
                <div className="flex flex-col justify-end">
                  <div className="rounded-lg bg-white/80 border border-blue-100 p-2 px-4 flex items-center justify-between h-[42px]">
                    <span className="text-[10px] font-mono text-blue-900 font-bold uppercase">Auto Balance:</span>
                    <span className={`font-mono text-sm font-extrabold ${balance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {formatINR(balance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            id="form-cancel-btn"
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            id="form-submit-btn"
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
          >
            Save Ticket Ledger
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
