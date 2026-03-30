import { useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import IsteAward from './components/IsteAward'
import AchievementsTicker from './components/AchievementsTicker'
import CareerMilestones from './components/CareerMilestones'
import Projects from './components/Projects'
import Innovation from './components/Innovation'
import CompetitionWins from './components/CompetitionWins'
import Leadership from './components/Leadership'
import AcademicExcellence from './components/AcademicExcellence'
import Certifications from './components/Certifications'
import Skills from './components/Skills'
import Contact from './components/Contact'
import CustomCursor from './components/CustomCursor'
import CursorTrail from './components/CursorTrail'
import Preloader from './components/Preloader'
import ScrollProgress from './components/ScrollProgress'
import SmoothScroll from './components/SmoothScroll'
import FloatingShapes from './components/FloatingShapes'
import useIsMobile from './hooks/useIsMobile'

function SectionDivider() {
  return (
    <div className="section-divider-animated max-w-2xl mx-auto px-8">
      <div className="divider-line" />
      <div className="divider-dot" />
      <div className="divider-line" />
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const onPreloaderComplete = useCallback(() => setLoaded(true), [])
  const isMobile = useIsMobile()

  return (
    <>
      {/* Butter-smooth scrolling */}
      <SmoothScroll />

      {/* Preloader */}
      <Preloader onComplete={onPreloaderComplete} />

      {/* Custom cursor + sparkle trail (desktop only) */}
      {!isMobile && <CustomCursor />}
      {!isMobile && <CursorTrail />}

      {/* Scroll progress bar */}
      {loaded && <ScrollProgress />}

      <div className={`relative min-h-screen bg-dark-900 ${loaded ? '' : 'overflow-hidden max-h-screen'}`}>
        {/* Animated grid overlay — desktop only */}
        {!isMobile && <div className="animated-grid" />}

        {/* Noise texture overlay */}
        <div className="noise-overlay" />

        {/* Floating geometric shapes with parallax — desktop only */}
        <FloatingShapes />

        {/* Ambient background orbs — simplified on mobile */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className={`absolute top-0 left-1/4 rounded-full blur-[120px] ${
            isMobile ? 'w-[250px] h-[250px] bg-primary/3' : 'w-[500px] h-[500px] bg-primary/5 animate-morph'
          }`} />
          {!isMobile && (
            <>
              <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] animate-morph-reverse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[100px] animate-morph-slow" />
            </>
          )}
        </div>

        <div className="relative z-10">
          <Navbar />
          <Hero />
          <SectionDivider />
          <IsteAward />
          <AchievementsTicker />
          <SectionDivider />
          <CareerMilestones />
          <SectionDivider />
          <Projects />
          <SectionDivider />
          <Innovation />
          <SectionDivider />
          <CompetitionWins />
          <SectionDivider />
          <Leadership />
          <SectionDivider />
          <AcademicExcellence />
          <SectionDivider />
          <Certifications />
          <SectionDivider />
          <Skills />
          <SectionDivider />
          <Contact />
        </div>
      </div>
    </>
  )
}
