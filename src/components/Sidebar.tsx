/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Laptop, 
  PlusCircle, 
  BarChart3, 
  LogOut, 
  Settings,
  X,
  Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen 
}) => {
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Customer Jobs', icon: Laptop },
    { id: 'new-job', label: 'Register Laptop', icon: PlusCircle },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false); // Auto-close on mobile
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          id="sidebar-overlay"
          className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside 
        id="sidebar-container"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-[#0F172A] text-slate-300 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-xs shrink-0">
              SLR
            </div>
            <div>
              <h1 className="font-sans text-sm font-bold tracking-tight text-white uppercase">SLR TECH HUB</h1>
              <span className="text-[10px] font-mono text-slate-500 font-medium tracking-wider">SERVICE PORTAL</span>
            </div>
          </div>
          <button 
            id="close-sidebar-btn"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 p-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-link-${item.id}`}
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User profile / session controls */}
        {currentUser && (
          <div className="p-4 border-t border-slate-700 bg-slate-900/50">
            <div className="flex items-center gap-3 p-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold text-white bg-slate-600">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{currentUser.name}</p>
                <p className="truncate text-xs text-slate-500 uppercase">{currentUser.role}</p>
              </div>
              <button 
                id="logout-btn"
                onClick={logout}
                title="Sign Out"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
            
            {/* Quick System Reset Button (Perfect for demoing) */}
            <button
              id="reset-db-btn"
              onClick={() => {
                if (window.confirm('Reset laptop database to initial default values?')) {
                  localStorage.removeItem('slr_tech_hub_jobs');
                  window.location.reload();
                }
              }}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/40 py-1.5 text-[10px] font-mono text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="h-3 w-3" />
              RESET DIAGNOSTICS DB
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
