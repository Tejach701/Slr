/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  UserCheck, 
  Smartphone, 
  Unlock, 
  Lock,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Laptop
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CustomerListView } from './components/CustomerListView';
import { CustomerForm } from './components/CustomerForm';
import { CustomerDetailsView } from './components/CustomerDetailsView';
import { InvoicePrint } from './components/InvoicePrint';
import { ReportsView } from './components/ReportsView';
import { CustomerJob, UserRole, JobStatus, HistoryRecord, PaymentRecord } from './types';
import { INITIAL_JOBS, SYSTEM_USERS } from './data';
import { initSyncChannel, triggerSyncUpdate } from './utils/helpers';

const MainAppContent: React.FC = () => {
  const { currentUser, login, isLoading } = useAuth();
  
  // App navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // CRUD Data State
  const [jobs, setJobs] = useState<CustomerJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<CustomerJob | null>(null);
  const [jobToEdit, setJobToEdit] = useState<CustomerJob | undefined>(undefined);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('slrtechhub@gmail.com');
  const [loginRole, setLoginRole] = useState<UserRole>('admin');
  const [loginPassword, setLoginPassword] = useState('Slrtech@123');
  const [loginError, setLoginError] = useState('');

  // Toast Sync Notification state
  const [showSyncToast, setShowSyncToast] = useState(false);

  // Initialize and load jobs
  useEffect(() => {
    const savedJobs = localStorage.getItem('slr_tech_hub_jobs');
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (e) {
        console.error('Failed to parse jobs', e);
        setJobs(INITIAL_JOBS);
      }
    } else {
      setJobs(INITIAL_JOBS);
      localStorage.setItem('slr_tech_hub_jobs', JSON.stringify(INITIAL_JOBS));
    }

    // Initialize cross-tab sync channel
    initSyncChannel(() => {
      // Reload jobs from storage
      const refreshedJobsStr = localStorage.getItem('slr_tech_hub_jobs');
      if (refreshedJobsStr) {
        try {
          setJobs(JSON.parse(refreshedJobsStr));
          setShowSyncToast(true);
          setTimeout(() => setShowSyncToast(false), 4000);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, []);

  // Sync update utility helper
  const syncAndSave = (updatedJobs: CustomerJob[]) => {
    setJobs(updatedJobs);
    localStorage.setItem('slr_tech_hub_jobs', JSON.stringify(updatedJobs));
    triggerSyncUpdate(); // Notify all other active tabs instantly
  };

  // Handle Create / Edit saving
  const handleSaveJob = (jobData: Partial<CustomerJob>) => {
    if (jobToEdit) {
      // EDIT MODE
      const updatedHistory: HistoryRecord = {
        id: 'HIST-' + Date.now(),
        date: new Date().toISOString(),
        updatedBy: currentUser ? currentUser.name : 'System',
        status: jobData.status || jobToEdit.status,
        remarks: `Updated core laptop attributes (${currentUser?.name})`
      };

      const updated = jobs.map(j => {
        if (j.id === jobToEdit.id) {
          const isStatusChanged = j.status !== jobData.status;
          return {
            ...j,
            ...jobData,
            updatedAt: new Date().toISOString(),
            complaintHistory: isStatusChanged 
              ? [updatedHistory, ...j.complaintHistory] 
              : j.complaintHistory
          } as CustomerJob;
        }
        return j;
      });

      syncAndSave(updated);
      
      // Update selectedJob if actively viewed
      const newlySaved = updated.find(x => x.id === jobToEdit.id);
      if (newlySaved) setSelectedJob(newlySaved);

      setActiveTab('jobs');
      setJobToEdit(undefined);
    } else {
      // CREATE MODE
      const newIdNum = 1000 + jobs.length + 1;
      const newId = `SLR-${newIdNum}`;

      const initialHistory: HistoryRecord = {
        id: 'HIST-INIT-' + Date.now(),
        date: new Date().toISOString(),
        updatedBy: currentUser ? currentUser.name : 'System',
        status: 'Pending',
        remarks: 'Job ticket registered in work station.'
      };

      const paymentHistory: PaymentRecord[] = [];
      if (jobData.advance && jobData.advance > 0) {
        paymentHistory.push({
          id: 'PAY-INIT-' + Date.now(),
          date: new Date().toISOString(),
          amount: jobData.advance,
          type: 'Advance',
          receivedBy: currentUser ? currentUser.name : 'System'
        });
      }

      const newJob: CustomerJob = {
        id: newId,
        customerName: jobData.customerName || '',
        phone: jobData.phone || '',
        brand: jobData.brand || '',
        model: jobData.model || '',
        serialNumber: jobData.serialNumber || 'N/A',
        complaint: jobData.complaint || '',
        accessories: jobData.accessories || 'None',
        amount: jobData.amount || 0,
        advance: jobData.advance || 0,
        balance: (jobData.amount || 0) - (jobData.advance || 0),
        status: 'Pending',
        deliveryDate: jobData.deliveryDate || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentHistory,
        complaintHistory: [initialHistory]
      };

      const updated = [newJob, ...jobs];
      syncAndSave(updated);
      setActiveTab('jobs');
    }
  };

  // Handle detailed record updates from details view (status / payment updates)
  const handleUpdateJobDetails = (updatedJob: CustomerJob) => {
    const updated = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
    syncAndSave(updated);
    setSelectedJob(updatedJob);
  };

  // Handle delete
  const handleDeleteJob = (id: string) => {
    const updated = jobs.filter(j => j.id !== id);
    syncAndSave(updated);
    if (selectedJob?.id === id) {
      setSelectedJob(null);
    }
  };

  // Quick Switch logins for SLR Staff
  const selectQuickLogin = (role: UserRole) => {
    setLoginRole(role);
    if (role === 'admin') {
      setLoginEmail('slrtechhub@gmail.com');
      setLoginPassword('Slrtech@123');
    } else if (role === 'staff1') {
      setLoginEmail('aadil@gmail.com');
      setLoginPassword('Adil@123');
    } else {
      setLoginEmail('ramswamy@gmail.com');
      setLoginPassword('Ram @123');
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Strict local simulation authentication (100% free of cost running!)
    const success = await login(loginEmail, loginRole, loginPassword);
    if (!success) {
      setLoginError('Invalid login email, role classification, or password mismatch.');
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50">
        <Wrench className="h-8 w-8 animate-spin text-blue-600" />
        <span className="mt-3 font-mono text-[10px] text-slate-500 font-bold tracking-widest uppercase">
          SLR Tech Hub booting...
        </span>
      </div>
    );
  }

  // Render Login page if no session
  if (!currentUser) {
    return (
      <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-slate-50 p-4">
        
        {/* Sync Indicator alert */}
        <div className="mb-6 w-full max-w-md rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-3xs flex items-center gap-3">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <p className="font-mono text-[11px] text-emerald-800 leading-normal">
            <span className="font-extrabold">SANDBOX RUNNING FREE OF COST</span><br />
            Cross-tab realtime updates, local state engine, and printing layouts are live with zero-config.
          </p>
        </div>

        {/* Corporate branding */}
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <Wrench className="h-6 w-6" />
          </div>
          <h1 className="mt-3 font-sans text-xl font-bold tracking-tight text-slate-950 uppercase">SLR TECH HUB</h1>
          <p className="font-mono text-[10px] font-bold text-slate-500 tracking-wider">SERVICE CONTROL PORTAL</p>
        </div>

        {/* Login Credentials Box */}
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-sans text-sm font-bold text-slate-900 tracking-tight text-center border-b border-slate-100 pb-4">
            Workshop Staff Authentication
          </h2>

          {loginError && (
            <div className="mt-4 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            {/* Choose Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">User Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['admin', 'staff1', 'staff2'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => selectQuickLogin(role)}
                    className={`rounded-lg py-2 font-mono text-[10px] font-bold border transition-all ${
                      loginRole === role 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {role === 'admin' ? 'ADMIN' : role === 'staff1' ? 'AADIL' : 'RAMSWAMY'}
                  </button>
                ))}
              </div>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Staff Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 font-mono text-xs text-slate-950 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-mono">Access Code (Password)</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs text-slate-950 focus:border-blue-500 focus:outline-hidden font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 font-mono text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
            >
              <Unlock className="h-4 w-4" />
              AUTHENTICATE ACCESS
            </button>
          </form>

          {/* Quick Creds Info */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Workshop Staff Logins
            </span>
            <div className="space-y-1 font-mono text-[9.5px] text-slate-500">
              <p>Admin: <span className="font-bold text-slate-700">slrtechhub@gmail.com</span> (Code: Slrtech@123)</p>
              <p>Aadil: <span className="font-bold text-slate-700">aadil@gmail.com</span> (Code: Adil@123)</p>
              <p>Ramswamy: <span className="font-bold text-slate-700">ramswamy@gmail.com</span> (Code: Ram @123)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle rendering of views
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            jobs={jobs}
            setActiveTab={setActiveTab}
            onViewJobDetails={(job) => {
              setSelectedJob(job);
              setActiveTab('job-details');
            }}
            onRegisterNew={() => {
              setJobToEdit(undefined);
              setActiveTab('new-job');
            }}
          />
        );
      case 'jobs':
        return (
          <CustomerListView 
            jobs={jobs}
            onViewDetails={(job) => {
              setSelectedJob(job);
              setActiveTab('job-details');
            }}
            onEdit={(job) => {
              setJobToEdit(job);
              setActiveTab('new-job');
            }}
            onDelete={handleDeleteJob}
          />
        );
      case 'new-job':
        return (
          <CustomerForm 
            jobToEdit={jobToEdit}
            onSave={handleSaveJob}
            onCancel={() => {
              setJobToEdit(undefined);
              setActiveTab('jobs');
            }}
          />
        );
      case 'reports':
        return (
          <ReportsView 
            jobs={jobs}
            onViewDetails={(job) => {
              setSelectedJob(job);
              setActiveTab('job-details');
            }}
          />
        );
      case 'job-details':
        return selectedJob ? (
          <CustomerDetailsView 
            job={selectedJob}
            onBack={() => setActiveTab('jobs')}
            onUpdateJob={handleUpdateJobDetails}
            onPrintInvoice={() => setActiveTab('invoice-print')}
          />
        ) : null;
      case 'invoice-print':
        return selectedJob ? (
          <InvoicePrint 
            job={selectedJob}
            onBack={() => setActiveTab('job-details')}
          />
        ) : null;
      default:
        return null;
    }
  };

  // If we are actively looking at the print invoice, render a full-width viewport without the Side Nav & Header
  if (activeTab === 'invoice-print') {
    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-10">
        {renderActiveView()}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen bg-slate-50/50">
      
      {/* Real-time sync notification toast (cross-tab event listener feedback) */}
      {showSyncToast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-emerald-100 bg-white p-4 shadow-md max-w-sm flex items-center gap-3 animate-bounce">
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Terminal className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Realtime Update Synced!</p>
            <p className="text-[10px] font-mono text-slate-500">Database synchronized across tabs instantaneously.</p>
          </div>
        </div>
      )}

      {/* Sidebar navigation panel */}
      <Sidebar 
        activeTab={activeTab === 'job-details' ? 'jobs' : activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Right container panel */}
      <div className="flex flex-1 flex-col md:pl-72">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          onQuickRegister={() => {
            setJobToEdit(undefined);
            setActiveTab('new-job');
          }}
        />

        {/* Content canvas */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
