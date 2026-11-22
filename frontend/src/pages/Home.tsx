import React from 'react';
import { UserVectorEmbeddingSpace } from '../components/dashboard/UserVectorEmbeddingSpace';
import { DailyCadenceTaskSection } from '../components/dashboard/DailyCadenceTaskSection';
import { RecentConversationsSection } from '../components/dashboard/RecentConversationsSection';

export const Home: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10 animate-fadeIn">
      {/* User Dashboard: Cognitive Profile & 3D Interactive Spider Web (Searches Index) */}
      <UserVectorEmbeddingSpace />

      {/* Daily Cadence: Dual-Brain Morning Planning (AM) & Evening Retrospective (PM) */}
      <DailyCadenceTaskSection />

      {/* Recent AI Sessions & Conversation History */}
      <RecentConversationsSection />
    </div>
  );
};
