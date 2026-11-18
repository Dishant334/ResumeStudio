import { Plus, X } from 'lucide-react'
import React, { useState } from 'react'

// Generic "add a line" list editor (certifications, achievements)
const ListForm = ({ data = [], onChange, title, hint, placeholder, icon: Icon }) => {
  const [value, setValue] = useState('')
  const add = () => {
    const v = value.trim()
    if (v) { onChange([...data, v]); setValue('') }
  }
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        <p className='text-sm text-gray-500'>{hint}</p>
      </div>
      <div className='flex gap-2'>
        <input type='text' value={value} placeholder={placeholder} className='flex-1 px-3 py-2 text-sm'
          onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
        <button onClick={add} disabled={!value.trim()} className='px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors'><Plus className='size-4' /></button>
      </div>
      {data.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>
          {Icon && <Icon className='size-10 mx-auto mb-2 text-gray-300' />}
          <p>Nothing added yet.</p>
        </div>
      ) : (
        <ul className='space-y-2'>
          {data.map((item, i) => (
            <li key={i} className='flex items-start justify-between gap-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm'>
              <span>{item}</span>
              <button onClick={() => onChange(data.filter((_, j) => j !== i))} className='text-slate-400 hover:text-red-500'><X className='size-4' /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default ListForm
