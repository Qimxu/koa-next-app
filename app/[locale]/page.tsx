'use client';

import { useEffect, useState } from 'react';
import BackgroundEffects from './components/BackgroundEffects';
import HeroSection from './sections/HeroSection';
import CoreFeaturesSection from './sections/CoreFeaturesSection';
import CodeExamplesSection from './sections/CodeExamplesSection';
import UIShowcasesSection from './sections/UIShowcasesSection';
import FeaturesSection from './sections/FeaturesSection';
import ArchitectureSection from './sections/ArchitectureSection';
import QuickStartSection from './sections/QuickStartSection';
import CTASection from './sections/CTASection';
import FooterSection from './sections/FooterSection';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <BackgroundEffects />
      <HeroSection isVisible={isVisible} />
      <CoreFeaturesSection />
      <CodeExamplesSection />
      <UIShowcasesSection />
      <FeaturesSection />
      <ArchitectureSection />
      <QuickStartSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
