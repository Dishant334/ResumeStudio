import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import MiniResume from './MiniResume'

const Chip = ({ children, className, z, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + delay, duration: 0.6 }}
    className={`absolute rounded-full bg-white px-4 py-2 text-sm font-medium shadow-[0_10px_30px_-10px_rgba(12,33,73,.35)] ring-1 ring-black/5 ${className}`}
    style={{ transform: `translateZ(${z}px)` }}
  >
    <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }} className='block'>
      {children}
    </motion.span>
  </motion.div>
)

// Three stacked real resume pages in CSS 3D, tilting with the pointer
const Hero3D = () => {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 18 })
  const sy = useSpring(my, { stiffness: 90, damping: 18 })
  const rotY = useTransform(sx, [-0.5, 0.5], [-22, 22])
  const rotX = useTransform(sy, [-0.5, 0.5], [16, -16])

  const onMove = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  const card = 'rounded-md shadow-[0_40px_80px_-30px_rgba(12,33,73,.55)] ring-1 ring-black/10'
  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} className='relative h-[520px] w-full' style={{ perspective: 1400 }}>
      <motion.div className='absolute inset-0 grid place-items-center' style={{ rotateX: rotX, rotateY: rotY, rotateZ: -4, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>
        <div className='relative' style={{ width: 300, height: 390, transformStyle: 'preserve-3d' }}>
          <motion.div className='absolute' style={{ left: -150, top: 30, transform: 'translateZ(-120px) rotateZ(-6deg)' }} animate={reduce ? {} : { y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
            <MiniResume template='developer' width={270} accent='#0c2149' className={card} />
          </motion.div>
          <motion.div className='absolute' style={{ left: 150, top: -20, transform: 'translateZ(-60px) rotateZ(5deg)' }} animate={reduce ? {} : { y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
            <MiniResume template='sidebar' width={270} accent='#1f5f4a' className={card} />
          </motion.div>
          <motion.div className='absolute inset-0' style={{ transform: 'translateZ(40px)' }} animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <MiniResume template='engineer' width={300} accent='#e4572e' className={card} />
          </motion.div>

          <Chip className='-left-24 top-24' z={120}>✓ ATS-friendly</Chip>
          <Chip className='-right-16 top-52' z={160} delay={0.4}>✨ AI-polished bullets</Chip>
          <Chip className='left-10 -bottom-6' z={100} delay={0.8}>↓ One-click PDF</Chip>
        </div>
      </motion.div>
    </div>
  )
}
export default Hero3D
