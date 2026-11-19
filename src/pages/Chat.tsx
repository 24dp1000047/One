import React, { useState } from 'react';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatArea } from '../components/chat/ChatArea';

export const Chat: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Desktop Chat Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 h-full">
        <ChatSidebar />
      </div>

      {/* Mobile Sidebar Modal */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[80vw] h-full bg-[#0d0d0d] shadow-2xl">
            <ChatSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Conversation Area */}
      <div className="flex-1 h-full min-w-0">
        <ChatArea onOpenSidebarMobile={() => setMobileSidebarOpen(true)} />
      </div>
    </div>
  );
};
