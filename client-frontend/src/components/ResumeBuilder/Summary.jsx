import { Loader2, Sparkle } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import api from '../../configs/api'
import toast from 'react-hot-toast'

const Summary = ({data,onChange,setResumeData} ) => {
  const {token} =useSelector(state=>state.auth)
  const [isGenerating,setIsGenerating]=useState(false)

  const generateSummary=async()=>{
    try{
      setIsGenerating(true)
      if(!data?.trim()){ toast.error('Write a rough summary first, then enhance it'); return }
      const prompt=`Improve this resume professional summary. Keep it truthful, concise and ATS-friendly; change length by at most 20-30 words: "${data}"`
      const response= await api.post('/api/ai/enhanced-pro-sum',{userContent: prompt},{headers:{Authorization:`Bearer ${token}`}})
      setResumeData(prev => ({...prev,professional_summary:response.data.enhancedContent}))
    }catch(err){
      toast.error(err?.response?.data?.message || err.message)
    }finally{
      setIsGenerating(false)
    }
  }
  return (
    <div className='space-y-4'>
     <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
          <p className='text-sm text-gray-500'>Add summary for your resume here</p>
        </div>
     
     <button disabled={isGenerating} onClick={generateSummary} className='flex items-center gap-2 px-3 py-1 text-sm bg-brand-100 text-brand-700 rounded
      hover:bg-brand-200 transition-colors disabled:opacity-60'>
      {isGenerating? (<Loader2 className='size-4 animate-spin '/>): (
           <Sparkle className='size-4'/>)}
           {isGenerating ? "Enhancing..." : "AI Enhance"}

     </button>
    </div>
     <div className='mt-6'>
      <textarea rows={7} value={data || ""} onChange={(e)=>onChange(e.target.value)} name="Summary" id="summary" className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 
      rounded-lg focus:ring focus:ring-brand-500 focus:border-brand-500 outline-none
       transition-colors resize-none' placeholder='Write Professional Summary'></textarea>
       <p className='text-xs text-gray-500 mt-2'>Keep it concise: 2–3 lines work best.</p>
     </div>

    </div>
  )
}

export default Summary
