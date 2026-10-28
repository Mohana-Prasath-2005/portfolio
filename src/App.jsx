import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Innovation from './components/Innovation'
import Journey from './components/Journey'
import Leadership from './components/Leadership'
import IsteAward from './components/IsteAward'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import SmoothScroll from './components/SmoothScroll'
import WorldStage from './three/WorldStage'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">Skip to content</a>

      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />

      {/* Persistent 3D environment behind every section */}
      <WorldStage />

      <Navbar />

      <main id="main" tabIndex={-1} className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Innovation />
        <Journey />
        <Leadership />
        <IsteAward />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </MotionConfig>
  )
}
