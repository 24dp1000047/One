import React from 'react';
import { ChatArea } from '../components/chat/ChatArea';

export const Chat: React.FC = () => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 h-full min-w-0">
        <ChatArea />
      </div>
    </div>
  );
};
