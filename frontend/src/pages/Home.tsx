import React from 'react';
import { UserVectorEmbeddingSpace } from '../components/dashboard/UserVectorEmbeddingSpace';
import { RecentConversationsSection } from '../components/dashboard/RecentConversationsSection';

export const Home: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10 animate-fadeIn">
      {/* 3D Vector Projection Chamber & Cognitive Profile */}
      <UserVectorEmbeddingSpace />

      {/* Recent AI Sessions & Conversation History */}
      <RecentConversationsSection />
    </div>
  );
};
