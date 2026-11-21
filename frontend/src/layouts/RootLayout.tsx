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
    <div className="flex h-screen w-screen overflow-hidden bg-[#040608] text-white selection:bg-[#B9D3FF] selection:text-[#04070F]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-[#07090F] border-r border-[#181C26] z-10">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
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
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden relative">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-[#040608] relative">
          {/* Subtle ASCII Matrix Dot Pattern */}
          <div className="absolute inset-0 pointer-events-none ascii-matrix-bg opacity-25" />
          
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
