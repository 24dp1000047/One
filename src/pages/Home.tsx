import React from 'react';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { UniversalInput } from '../components/dashboard/UniversalInput';
import { QuickActionCards } from '../components/dashboard/QuickActionCards';
import { RecentProjectsSection } from '../components/dashboard/RecentProjectsSection';
import { FeaturedInspirationSection } from '../components/dashboard/FeaturedInspirationSection';

export const Home: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* 1. Hero with 3D Animated Orb */}
      <HeroBanner />

      {/* 2. Universal Prompt Input */}
      <UniversalInput />

      {/* 3. Quick Action Hubs */}
      <QuickActionCards />

      {/* 4. Recent Creations */}
      <RecentProjectsSection />

      {/* 5. Community Inspiration Feed */}
      <FeaturedInspirationSection />
    </div>
  );
};
