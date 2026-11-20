import React from 'react';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { InsideGlassSection } from '../components/dashboard/InsideGlassSection';
import { UniversalInput } from '../components/dashboard/UniversalInput';
import { QuickActionCards } from '../components/dashboard/QuickActionCards';
import { RecentProjectsSection } from '../components/dashboard/RecentProjectsSection';
import { FeaturedInspirationSection } from '../components/dashboard/FeaturedInspirationSection';

export const Home: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10 animate-fadeIn">
      {/* 1. Hero with ASCII Sphere & Beacon Generative Art (Image 1 & 2 match) */}
      <HeroBanner />

      {/* 2. Inside ONe Studio: Perspective Wireframe Viewport (Image 3 match) */}
      <InsideGlassSection />

      {/* 3. Universal Prompt Input */}
      <UniversalInput />

      {/* 4. Quick Action Hubs */}
      <QuickActionCards />

      {/* 5. Recent Creations */}
      <RecentProjectsSection />

      {/* 6. Community Inspiration Feed */}
      <FeaturedInspirationSection />
    </div>
  );
};
