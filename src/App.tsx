import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DioFeature } from './components/DioFeature';
import { WorkGrid } from './components/WorkGrid';
import { Turntables } from './components/Turntables';
import { ModelViewer } from './components/ModelViewer';
import { RiggingSection } from './components/RiggingSection';
import { UnitySection } from './components/UnitySection';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Lightbox } from './components/Lightbox';
import { MotionEffects } from './components/MotionEffects';

import {
  WORK_CATEGORIES,
  TURNTABLES,
  RIGGING_ITEMS,
  UNITY_ITEMS,
} from './data/portfolioData';
import { LightboxMedia } from './types';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('work');
  const [activeMedia, setActiveMedia] = useState<LightboxMedia | null>(null);

  // Intersection observer to highlight current nav link and trigger chapter animations
  useEffect(() => {
    document.body.classList.add('motion-ready', 'jojo-overdrive');

    const sections = document.querySelectorAll('main > .section, section.hero');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('chapter-live');
            if (entry.target.id) {
              setActiveSection(entry.target.id);
            }
          }
        });
      },
      { rootMargin: '-15% 0px -60% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const characterCategory = WORK_CATEGORIES.slice(0, 1);
  const remainingCategories = WORK_CATEGORIES.slice(1);

  return (
    <>
      <Navbar activeSection={activeSection} />

      <main>
        <Hero onOpenMedia={setActiveMedia} />

        {/* ============ WORK (Characters first) ============ */}
        <section className="section chapter-live" id="work">
          <div className="section__head ink-chapter ink-arrived" data-chapter="CHAPTER 01 · FEATURED ART">
            <h2 className="section__title">Selected Work</h2>
            <p className="section__sub">
              Characters first / then Roblox UGC, creatures and production work. Click any panel to inspect.
            </p>
          </div>

          <DioFeature onOpenMedia={setActiveMedia} />

          <div id="work-cats-top">
            <WorkGrid categories={characterCategory} onOpenMedia={setActiveMedia} />
          </div>
        </section>

        {/* ============ TURNTABLES ============ */}
        <Turntables items={TURNTABLES} onOpenMedia={setActiveMedia} />

        {/* ============ 3D VIEWER ============ */}
        <ModelViewer />

        {/* ============ RIGGING & ANIMATION ============ */}
        <RiggingSection items={RIGGING_ITEMS} onOpenMedia={setActiveMedia} />

        {/* ============ UNITY ============ */}
        <UnitySection items={UNITY_ITEMS} onOpenMedia={setActiveMedia} />

        {/* ============ WORK (Remaining categories) ============ */}
        <section className="section chapter-live" id="work-more">
          <div className="section__head ink-chapter ink-arrived" data-chapter="CHAPTER 06 · MORE WORK">
            <h2 className="section__title">UGC / Creatures / Props</h2>
            <p className="section__sub">
              Production-ready assets across Roblox, creatures, weapons and client-focused work.
            </p>
          </div>

          <div id="work-cats-rest">
            <WorkGrid categories={remainingCategories} onOpenMedia={setActiveMedia} />
          </div>
        </section>

        {/* ============ ABOUT ============ */}
        <AboutSection />

        {/* ============ EXPERIENCE & EDUCATION ============ */}
        <ExperienceSection />

        {/* ============ CONTACT ============ */}
        <ContactSection />
      </main>

      <Footer />

      {/* Lightbox Modal */}
      <Lightbox media={activeMedia} onClose={() => setActiveMedia(null)} />

      {/* Motion & JoJo effects, Sound theme & Stand Console */}
      <MotionEffects />
    </>
  );
};
