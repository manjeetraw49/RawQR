import React from 'react';
import { Hero } from '../sections/Hero';
import { GeneratorWorkspace } from '../components/Generator/GeneratorWorkspace';
import { HowItWorks } from '../sections/HowItWorks';
import { Features } from '../sections/Features';
import { FAQ } from '../sections/FAQ';

export const Home: React.FC = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <GeneratorWorkspace />
      <HowItWorks />
      <Features />
      <FAQ />
    </main>
  );
};
