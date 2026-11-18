import { Palette } from 'lucide-react'
import React, { useState } from 'react'

const COLORS = [
  '#3B82F6', '#1E3A8A', '#0EA5E9', '#06B6D4', '#14B8A6', '#10B981', '#166534', '#4D7C0F',
  '#6366F1', '#4338CA', '#7C3AED', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#DC2626',
  '#991B1B', '#EA580C', '#F59E0B', '#CA8A04', '#92400E', '#475569', '#111827', '#0F766E',
]

function Colorpicker({ selectedColor, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='relative'>
      <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1.5 text-sm text-brand-700 bg-brand-50 hover:bg-brand-100 ring-1 ring-brand-200 transition-colors px-3 py-2 rounded-lg'>
        <span className='size-3.5 rounded-full ring-1 ring-black/10' style={{ background: selectedColor }} />
        <Palette size={14} />
        <span className='max-sm:hidden'>Accent</span>
      </button>
      {isOpen && (
        <>
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />
          <div className='absolute z-20 mt-2 p-3 w-56 bg-white rounded-xl border border-slate-200 shadow-xl grid grid-cols-6 gap-2'>
            {COLORS.map((c) => (
              <button key={c} aria-label={c} onClick={() => { onChange(c); setIsOpen(false) }}
                className={`size-7 rounded-full ring-offset-1 transition-transform hover:scale-110 ${selectedColor === c ? 'ring-2 ring-slate-800' : 'ring-1 ring-black/10'}`}
                style={{ backgroundColor: c }} />
            ))}
            <label className='col-span-6 flex items-center gap-2 text-xs text-slate-500 mt-1'>
              Custom
              <input type='color' value={selectedColor || '#3B82F6'} onChange={(e) => onChange(e.target.value)} className='h-7 w-full p-0 border-0 cursor-pointer' />
            </label>
          </div>
        </>
      )}
    </div>
  )
}

export default Colorpicker
