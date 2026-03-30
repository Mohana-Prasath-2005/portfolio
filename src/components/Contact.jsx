import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa'
import SpotlightCard from './SpotlightCard'
import MagneticButton from './MagneticButton'


const links = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'mohanaprasath8917@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&to=mohanaprasath8917@gmail.com',
  },
  {
    icon: FaPhone,
    label: 'Phone',
    value: '+91 8098286056',
    href: 'tel:+918098286056',
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    value: 'Mohana Prasath G',
    href: 'https://www.linkedin.com/in/mohana-prasath-g-279139267/',
  },
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary font-mono text-sm mb-2">Contact</p>
          <h2 className="section-title mx-auto text-center">
Let's Build Something
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Open to full-time roles, collaborations, and interesting engineering challenges.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {links.map((link, idx) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * idx }}
              className="group"
            >
              <SpotlightCard className="glass-hover rounded-xl p-4 flex items-center gap-4 h-full">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <link.icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs">{link.label}</p>
                  <p className="text-white text-sm truncate">{link.value}</p>
                </div>
              </SpotlightCard>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <MagneticButton
            as="a"
            href="https://mail.google.com/mail/?view=cm&to=mohanaprasath8917@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-uiverse text-base px-10 py-4"
            strength={0.4}
          >
            Say Hello
          </MagneticButton>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 pt-8 border-t border-white/5 text-center"
        >
          <p className="text-slate-600 text-sm">
            Designed & Built by Mohana Prasath G
          </p>
        </motion.div>
      </div>
    </section>
  )
}
