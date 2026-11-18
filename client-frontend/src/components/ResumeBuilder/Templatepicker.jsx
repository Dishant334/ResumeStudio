import { Check, Layout, X } from 'lucide-react'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { templates } from '../templates/registry'
import { sampleResume } from '../templates/sampleData'

const THUMB_W = 794

const Thumb = ({ t, accent }) => {
  const Template = t.Component
  const box = useRef(null)
  const [scale, setScale] = useState(0.3)
  useLayoutEffect(() => {
    if (box.current) setScale(box.current.clientWidth / THUMB_W)
  }, [])
  return (
    <div ref={box} className='relative w-full overflow-hidden bg-white rounded-md border border-gray-200' style={{ aspectRatio: '794 / 1000' }}>
      <div className='origin-top-left pointer-events-none resume-page' style={{ width: THUMB_W, transform: `scale(${scale})` }}>
        <Template data={sampleResume} accentColor={accent} />
      </div>
    </div>
  )
}

const Templatepicker = ({ selectedTemplate, onChange, accentColor = '#3B82F6' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('All')
  const current = templates.find((t) => t.id === selectedTemplate) || templates[0]
  const shown = templates.filter((t) => filter === 'All' || t.tag === filter)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-1.5 text-sm text-brand-700 bg-brand-50 hover:bg-brand-100 ring-1 ring-brand-200 px-3 py-2 rounded-lg transition-colors'
      >
        <Layout size={14} />
        <span className='max-sm:hidden'>{current.name}</span>
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden' onClick={() => setIsOpen(false)}>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between px-6 py-4 border-b'>
              <div>
                <h3 className='text-lg font-semibold'>Choose a template</h3>
                <p className='text-sm text-slate-500'>Live previews with sample data. Your content is preserved when you switch.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className='p-2 rounded-lg hover:bg-slate-100'><X className='size-5' /></button>
            </div>
            <div className='flex gap-2 px-6 pt-4'>
              {['All', 'Engineering', 'General'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-sm transition-colors ${filter === f ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{f}</button>
              ))}
            </div>
            <div className='overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 gap-5'>
              {shown.map((t) => {
                const active = t.id === selectedTemplate
                return (
                  <button key={t.id} onClick={() => { onChange(t.id); setIsOpen(false) }}
                    className={`text-left rounded-xl p-2 transition-all hover:-translate-y-0.5 hover:shadow-lg ${active ? 'ring-2 ring-brand-500 bg-brand-50' : 'ring-1 ring-slate-200 bg-white'}`}>
                    <div className='relative'>
                      <Thumb t={t} accent={accentColor} />
                      {active && <div className='absolute top-2 right-2 size-6 bg-brand-600 rounded-full flex items-center justify-center'><Check className='size-4 text-white' /></div>}
                    </div>
                    <div className='px-1 pt-2 pb-1'>
                      <div className='flex items-center gap-2'>
                        <h4 className='font-semibold text-slate-800'>{t.name}</h4>
                        {t.tag === 'Engineering' && <span className='text-[10px] uppercase tracking-wide bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded'>Eng</span>}
                      </div>
                      <p className='text-xs text-slate-500 mt-0.5'>{t.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Templatepicker
