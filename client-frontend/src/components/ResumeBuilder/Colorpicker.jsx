import { Palette } from 'lucide-react'
import React, { useMemo, useState } from 'react'

function Colorpicker({selectedColor,onChange}) {
    const colors=useMemo(()=>[
  { name: "Blue", value: "#3B82F6" },
  { name: "Sky Blue", value: "#0EA5E9" },
  { name: "Light Blue", value: "#38BDF8" },
  { name: "Navy Blue", value: "#1E3A8A" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Deep Indigo", value: "#4338CA" },
  { name: "Violet", value: "#7C3AED" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Soft Purple", value: "#A78BFA" },
  { name: "Fuchsia", value: "#D946EF" },
  { name: "Emerald", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Mint", value: "#34D399" },
  { name: "Forest Green", value: "#166534" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Orange", value: "#F97316" },
  { name: "Deep Orange", value: "#EA580C" },
  { name: "Gold", value: "#D97706" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Red", value: "#EF4444" },
  { name: "Crimson", value: "#DC2626" },
  { name: "Pink", value: "#EC4899" },
  { name: "Soft Pink", value: "#F9A8D4" },
  { name: "Slate", value: "#64748B" },
  { name: "Cool Gray", value: "#6B7280" },
  { name: "Warm Gray", value: "#78716C" },
  { name: "Charcoal", value: "#111827" },
  { name: "Steel Gray", value: "#475569" },
  { name: "Brown", value: "#92400E" },
  { name: "Chocolate", value: "#78350F" },
  { name: "Olive", value: "#3F6212" },
  { name: "Sand", value: "#E7E5E4" },
  { name: "Royal Blue", value: "#2563EB" },
  { name: "Azure", value: "#0284C7" },
  { name: "Denim", value: "#1D4ED8" },
  { name: "Midnight", value: "#020617" },
  { name: "Sea Green", value: "#059669" },
  { name: "Jade", value: "#047857" },
  { name: "Pine", value: "#065F46" },
  { name: "Moss", value: "#4D7C0F" },
  { name: "Copper", value: "#B45309" },
  { name: "Rust", value: "#C2410C" },
  { name: "Burnt Orange", value: "#9A3412" },
  { name: "Mustard", value: "#CA8A04" },
  { name: "Wine", value: "#7F1D1D" },
  { name: "Maroon", value: "#991B1B" },
  { name: "Berry", value: "#9F1239" },
  { name: "Plum", value: "#701A75" },
  { name: "Ash", value: "#9CA3AF" },
  { name: "Stone", value: "#A8A29E" },
  { name: "Smoke", value: "#CBD5E1" },
  { name: "Pearl", value: "#F1F5F9" },


    ],[])
    const [isOpen,setIsOpen]=useState(false)
  return (
    <div>
      <button onClick={()=>setIsOpen(!isOpen)} className='flex items-ceter gap-1 text-sm text-purple-600 bg-linear-to-br from-purple-100 to ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg'>
        <Palette size={14}/>
        <span className='max-sm:hidden'>Accent</span>
      </button>
      {isOpen &&
      <div className=' w-40 flex gap-2 flex-wrap'> 
      {colors.map((color)=>(
        <div key={color.name}
         onClick={()=>{onChange(color.value) 
         setIsOpen(!isOpen)}} 
         className='cursor-pointer'>
            <div 
              style={{ backgroundColor: color.value }}
              className="w-4 h-4"/>
            </div>
     ) )}

   
     </div>
    }
    </div>
  )
}

export default Colorpicker
