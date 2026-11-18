import { Briefcase, Loader2, Plus, Sparkle, Trash2 } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../configs/api';

const ExperienceForm = ({data,onChange}) => {
    
    const { token }=useSelector(state=>state.auth)
    const [generatingIndex,setGeneratingIndex]=useState(-1) 
    const addExperience=()=>{
        const newExperience={
            company:"",
            position:"",
            start_date:"",
            end_date:"",
            description:"",
            isCurrent:false
        };
        onChange([...data,newExperience])
    }

    const removeExperiecne=(index)=>{
        const updated =data.filter((_,i)=>i!=index)
        onChange(updated)
    }

    const updateExperience=(index,field,value)=>{
        const updated=[...data];
        updated[index]={...updated[index],[field]:value}
        onChange(updated)
    }
    
    const generateDescription=async(index)=>{
        setGeneratingIndex(index)
        const experience=data[index]
        if(!experience.description?.trim()){ toast.error('Write a rough description first'); setGeneratingIndex(-1); return }
        const prompt=`Position: ${experience.position} at ${experience.company}.\nDescription: ${experience.description}`

        try{
            const {data}=await api.post('/api/ai/enhanced-job-desc',{userContent:prompt},{headers:{Authorization:`Bearer ${token}`}})
            updateExperience(index,"description",data.enhancedContent)
        }catch(error){
            toast.error(error?.response?.data?.message || error.message)
        }finally{
            setGeneratingIndex(-1)
        }
    }
    return (
        <div>
    <div className='flex items-center justify-between'>
        <div>
        <h1 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h1>
        <p className=' text-sm text-gray-500'>Add your job experience</p>
         </div>
        <div>
            <button onClick={()=>addExperience()} className='flex items-center gap-2 px-3 py-2 text-sm bg-brand-100 text-brand-700 rounded hover:bg-brand-200 transition-colors'>
               <Plus className='size-4'/>Add Experience
            </button>
         </div>
    </div>
    {data.length===0 ? (
        <div className='text-center py-8 text-gray-500'>
        <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300'/>
        <p>No work experience added yet.</p>
        <p className='text-sm'>Click "Add Experience" to get started.</p>
        </div>
    ):(<div className='space-y-4'>
       {data.map((experience,index)=>(
        <div className='p-4 border border-gray-200 rounded-lg space-y-3' key={index}>
            <div className='flex justify-between items-start'>
           <h4>Experience #{index+1}</h4>
           <button onClick={()=>removeExperiecne(index)} className='text-red-500 hover:text-red-700 transition-colors'>
            <Trash2 className='size-4'/>
           </button>
            </div>
            <div className='grid md:grid-cols-2 gap-3'>
                <input value={experience.company || ""} onChange={(e)=>updateExperience(index,"company",e.target.value)} 
                type="text" placeholder='Company Name' className='px-3 py-2 text-sm rounded-lg' />
                 <input value={experience.position || ""} onChange={(e)=>updateExperience(index,"position",e.target.value)} 
                type="text" placeholder='Position Name' className='px-3 py-2 text-sm rounded-lg' />
                 <input value={experience.start_date || ""} onChange={(e)=>updateExperience(index,"start_date",e.target.value)} 
                type="month" className='px-3 py-2 text-sm rounded-lg' />                         
                <input value={experience.end_date || ""} onChange={(e)=>updateExperience(index,"end_date",e.target.value)} 
                type="month" disabled={experience.isCurrent}  className='px-3 py-2 text-sm rounded-lg  disabled:bg-gray-100' />
            </div>
           <label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={experience.isCurrent}
    onChange={(e) =>
      updateExperience(index, "isCurrent", e.target.checked)
    }
  />
  <span className="text-sm text-gray-700">Currently working here</span>
</label>


            <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium text-gray-700'>Job Description</label>
                    <button onClick={()=>generateDescription(index)} disabled={generatingIndex ===index || !experience.position || !experience.company} className='flex items-center gap-1 px-2 py-1 text-xs bg-brand-100 text-brand-700 rounded hover:bg-brand-200 transition-colors disabled:opacity-50'>
                     {generatingIndex===index  ?  <Loader2 className='animate-spin size-3'/> :   ( <Sparkle className='size-3'/>) }
                        Enhance with AI
                    </button>
                </div>
                <textarea value={experience.description || ""} onChange={(e)=>updateExperience(index,'description',e.target.value)} rows={4} className='w-full text-sm px-3 py-2 rounded-lg resize-none' placeholder='Describe your key responsibilities and achievements'></textarea>
            </div>
        </div>
       ))}
    </div>)}
    </div>

  )
}

export default ExperienceForm
