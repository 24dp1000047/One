import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';
import { CommandPalette } from '../components/common/CommandPalette';
import { ToastContainer } from '../components/common/ToastContainer';
import { X } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090909] text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-[#0c0c0c] border-r border-[#242424] z-10">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-[#090909] relative">
          {/* Subtle Cybernetic Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none subtle-grid opacity-30" />
          
          {/* Page Outlet */}
          <div className="relative z-10 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Utilities */}
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};
