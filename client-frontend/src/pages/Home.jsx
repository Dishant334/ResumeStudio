import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { ArrowRight, Code2, Download, FileText, GraduationCap, Github, Linkedin, ScanSearch, Sparkles, Layers } from 'lucide-react'
import Hero3D from '../components/home/Hero3D'
import MiniResume from '../components/home/MiniResume'
import { templates } from '../components/templates/registry'

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] },
})

const features = [
  { icon: ScanSearch, title: 'Built to pass ATS', text: 'Clean single-column structure and real text – recruiters’ parsers read every word.' },
  { icon: GraduationCap, title: 'Made for engineering students', text: 'Education-first layouts with CGPA, projects with tech stack, internships, certifications and achievements.' },
  { icon: Sparkles, title: 'AI that edits, not invents', text: 'Tighten your summary and turn rough notes into action-verb bullets. Or import an old PDF and start from there.' },
  { icon: Layers, title: 'Nine live templates', text: 'Switch layout and accent colour any time – your content follows instantly.' },
  { icon: Code2, title: 'Share a public link', text: 'Publish a read-only page for your resume and send it with a single URL.' },
  { icon: Download, title: 'Pixel-clean PDF', text: 'Export an A4 PDF that looks exactly like the preview.' },
]

const steps = [
  ['01', 'Fill in your details', 'Education, skills, projects, internships – guided section by section.'],
  ['02', 'Pick a template', 'Preview real layouts with your data and set an accent colour.'],
  ['03', 'Export & apply', 'Download the PDF or share the public link.'],
]

const Home = () => {
  const { user } = useSelector((s) => s.auth)
  const eng = templates.filter((t) => t.tag === 'Engineering')

  return (
    <div className='bg-paper text-ink overflow-x-hidden'>
      {/* nav */}
      <header className='max-w-7xl mx-auto px-5 py-5 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2 font-display text-2xl font-semibold'>
          <span className='grid size-8 place-items-center rounded-md bg-ink text-paper'><FileText className='size-4' /></span>ResumeStudio
        </Link>
        <nav className='hidden md:flex items-center gap-8 text-sm text-stone-600'>
          <a href='#features' className='hover:text-ink transition-colors'>Features</a>
          <a href='#templates' className='hover:text-ink transition-colors'>Templates</a>
          <a href='#how' className='hover:text-ink transition-colors'>How it works</a>
        </nav>
        <div className='flex items-center gap-2 text-sm'>
          {user ? (
            <Link to='/app' className='rounded-full bg-ink text-paper px-5 py-2 hover:bg-brand-600 transition-colors'>Dashboard</Link>
          ) : (
            <>
              <Link to='/app?state=login' className='px-4 py-2 rounded-full hover:bg-black/5 transition-colors'>Log in</Link>
              <Link to='/app?state=signup' className='rounded-full bg-ink text-paper px-5 py-2 hover:bg-brand-600 transition-colors'>Get started</Link>
            </>
          )}
        </div>
      </header>

      {/* hero */}
      <section className='max-w-7xl mx-auto px-5 pt-10 pb-20 grid lg:grid-cols-2 gap-10 items-center'>
        <div>
          <motion.p {...reveal(0)} className='inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-brand-700 font-medium'>
            <span className='h-px w-8 bg-brand-600' />Resume builder for engineers
          </motion.p>
          <motion.h1 {...reveal(1)} className='font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] font-medium mt-5'>
            A resume that <em className='text-brand-600 not-italic font-semibold'>reads</em> as well as you code.
          </motion.h1>
          <motion.p {...reveal(2)} className='mt-6 text-lg text-stone-600 max-w-xl'>
            Recruiter-tested layouts for B.Tech and engineering students. Add projects, CGPA, internships and certifications, polish the wording, and export an ATS-ready PDF.
          </motion.p>
          <motion.div {...reveal(3)} className='mt-9 flex flex-wrap items-center gap-3'>
            <Link to={user ? '/app' : '/app?state=signup'} className='group inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-white font-medium hover:bg-brand-600 transition-colors'>
              Build my resume <ArrowRight className='size-4 transition-transform group-hover:translate-x-1' />
            </Link>
            <a href='#templates' className='rounded-full px-7 py-3.5 font-medium ring-1 ring-ink/20 hover:bg-white transition-colors'>See templates</a>
          </motion.div>
          <motion.ul {...reveal(4)} className='mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-stone-500'>
            <li>9 templates</li><li>ATS-friendly</li><li>Free PDF export</li>
          </motion.ul>
        </div>
        <Hero3D />
      </section>

      {/* features */}
      <section id='features' className='bg-ink text-paper py-24'>
        <div className='max-w-7xl mx-auto px-5'>
          <motion.h2 {...reveal()} className='font-display text-4xl sm:text-5xl font-medium max-w-2xl leading-tight'>Everything a placement season asks for.</motion.h2>
          <div className='mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden'>
            {features.map((f, i) => (
              <motion.div key={f.title} {...reveal(i % 3)} className='bg-ink p-8 hover:bg-[#16336b] transition-colors'>
                <f.icon className='size-6 text-brand-400' />
                <h3 className='mt-5 text-lg font-semibold'>{f.title}</h3>
                <p className='mt-2 text-stone-400 text-sm leading-relaxed'>{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* templates */}
      <section id='templates' className='py-24'>
        <div className='max-w-7xl mx-auto px-5'>
          <motion.p {...reveal()} className='text-xs uppercase tracking-[0.18em] text-brand-700 font-medium'>Engineering templates</motion.p>
          <motion.h2 {...reveal(1)} className='font-display text-4xl sm:text-5xl font-medium mt-3 max-w-2xl leading-tight'>Pick a layout. Keep your content.</motion.h2>
          <div className='mt-14 grid grid-cols-2 lg:grid-cols-5 gap-6'>
            {eng.map((t, i) => (
              <motion.div key={t.id} {...reveal(i)} whileHover={{ y: -10, rotate: i % 2 ? 1 : -1 }} className='group'>
                <MiniResume template={t.id} width={220} className='rounded-md ring-1 ring-black/10 shadow-[0_20px_40px_-20px_rgba(12,33,73,.4)] w-full! h-auto!' style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1.3' }} />
                <p className='mt-3 font-semibold'>{t.name}</p>
                <p className='text-xs text-stone-500'>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* how */}
      <section id='how' className='pb-24'>
        <div className='max-w-7xl mx-auto px-5 grid md:grid-cols-3 gap-10 border-t border-ink/15 pt-14'>
          {steps.map(([n, t, d], i) => (
            <motion.div key={n} {...reveal(i)}>
              <p className='font-display text-6xl text-brand-500'>{n}</p>
              <h3 className='mt-3 text-xl font-semibold'>{t}</h3>
              <p className='mt-2 text-stone-600'>{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className='max-w-7xl mx-auto px-5 pb-20'>
        <motion.div {...reveal()} className='rounded-3xl bg-brand-500 text-white px-8 py-16 text-center'>
          <h2 className='font-display text-4xl sm:text-5xl font-medium'>Your next interview starts here.</h2>
          <p className='mt-3 text-white/85'>Free to use. No credit card, no watermark.</p>
          <Link to={user ? '/app' : '/app?state=signup'} className='mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-medium hover:bg-white hover:text-ink transition-colors'>
            Create your resume <ArrowRight className='size-4' />
          </Link>
        </motion.div>
      </section>

      <footer className='border-t border-ink/15'>
        <div className='max-w-7xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500'>
          <p>© {new Date().getFullYear()} ResumeStudio</p>
          <div className='flex gap-4'>
            <a aria-label='GitHub' href='https://github.com/Dishant334' target='_blank' rel='noreferrer' className='hover:text-ink'><Github className='size-5' /></a>
            <a aria-label='LinkedIn' href='https://www.linkedin.com/in/dishant-kumar-a41189314/' target='_blank' rel='noreferrer' className='hover:text-ink'><Linkedin className='size-5' /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
