/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, Plus, RefreshCw, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  onQuickRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  onQuickRegister
}) => {
  const { currentUser } = useAuth();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'System Overview';
      case 'jobs':
        return 'Customer Job Database';
      case 'new-job':
        return 'Register New Job';
      case 'reports':
        return 'Financial Intelligence';
      default:
        return 'SLR TECH HUB';
    }
  };

  return (
    <header 
      id="navbar-container"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-6 backdrop-blur-md"
    >
      {/* Left items: Mobile Menu toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          id="mobile-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h2 className="font-sans text-lg font-bold tracking-tight text-slate-900">{getPageTitle()}</h2>
          <span className="hidden sm:inline text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
            SLR Tech Hub Service Portal
          </span>
        </div>
      </div>

      {/* Right items: Realtime Sync Indicator, Add Shortcut, User Badge */}
      <div className="flex items-center gap-4">
        {/* Realtime cross-tab channel indicator */}
        <div 
          id="realtime-sync-badge"
          className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100 font-mono text-[10px] font-semibold text-emerald-700 shadow-3xs"
          title="Multi-tab Sync Channel Active. No internet required!"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="hidden md:inline">REAL-TIME SYNC</span>
          <span className="md:hidden">SYNCED</span>
        </div>

        {/* Quick Actions */}
        {activeTab !== 'new-job' && (
          <button
            id="header-quick-register-btn"
            onClick={onQuickRegister}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-2 font-sans text-xs font-semibold text-white hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>REGISTER DEVICE</span>
          </button>
        )}

        {/* Profile Avatar indicator */}
        {currentUser && (
          <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-bold ${currentUser.color}`}>
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-tight">{currentUser.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
