import { FolderCode,Plus,  Trash2,Sparkle, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'

const ProjectForm = ({data,onChange}) => {
    const {token}=useSelector(state=>state.auth)
    const [busy,setBusy]=useState(-1)
    const enhance=async(index)=>{
        const p=data[index]
        if(!p.description?.trim()){ toast.error('Write a rough description first'); return }
        setBusy(index)
        try{
            const prompt=`Project: ${p.name} (${p.type||''}). Tech: ${p.tech||''}.\nDescription: ${p.description}`
            const res=await api.post('/api/ai/enhanced-job-desc',{userContent:prompt},{headers:{Authorization:`Bearer ${token}`}})
            updateProject(index,'description',res.data.enhancedContent)
        }catch(err){ toast.error(err?.response?.data?.message || err.message) }
        finally{ setBusy(-1) }
    }
      const addProject=()=>{
        const newProject={
            name:"",
            type:"",
            tech:"",
            link:"",
            description:"",
        };
        onChange([...data,newProject])
    }
    const removeProject=(index)=>{
        const updated =data.filter((_,i)=>i!=index)
        onChange(updated)
    }

    const updateProject=(index,field,value)=>{
        const updated=[...data];
        updated[index]={...updated[index],[field]:value}
        onChange(updated)
    }
  return (
    <div>
    <div className='flex items-center justify-between'>
        <div>
        <h1 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h1>
        <p className=' text-sm text-gray-500'>Add your Project details</p>
         </div>
        <div>
            <button onClick={()=>addProject()} className='flex items-center gap-2 px-3 py-2 text-sm bg-brand-100 text-brand-700 rounded hover:bg-brand-200 transition-colors'>
               <Plus className='size-4'/>Add Project
            </button>
         </div>
    </div>
    {data.length===0 ? (
        <div className='text-center py-8 text-gray-500'>
        <FolderCode className='w-12 h-12 mx-auto mb-3 text-gray-300'/>
        <p>No project added yet.</p>
        <p className='text-sm'>Click "Add project" to get started.</p>
        </div>
    ):
    (<div className='space-y-4'>
       {data.map((project,index)=>(
        <div className='p-4 border border-gray-200 rounded-lg space-y-3' key={index}>
            <div className='flex justify-between items-start'>
           <h4>Project #{index+1}</h4>
           <button onClick={()=>removeProject(index)} className='text-red-500 hover:text-red-700 transition-colors'>
            <Trash2 className='size-4'/>
           </button>
            </div>
            <div className='grid md:grid-cols-2 gap-3'>
                <input value={project.name || ""} onChange={(e)=>updateProject(index,"name",e.target.value)} 
                type="text" placeholder='Project Name' className='px-3 py-2 text-sm rounded-lg' />
                 <input value={project.type || ""} onChange={(e)=>updateProject(index,"type",e.target.value)} 
                type="text" placeholder="Type (e.g., Web App, IoT, ML)" className='px-3 py-2 text-sm rounded-lg' />
                 <input value={project.tech || ""} onChange={(e)=>updateProject(index,"tech",e.target.value)} 
                type="text" placeholder="Tech stack (React, Node, MongoDB)" className='px-3 py-2 text-sm rounded-lg' />
                 <input value={project.link || ""} onChange={(e)=>updateProject(index,"link",e.target.value)} 
                type="text" placeholder="GitHub / live link" className='px-3 py-2 text-sm rounded-lg' />
            </div>
         
            <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium text-gray-700'>Project Description</label>
                    <button disabled={busy===index} onClick={()=>enhance(index)} className='flex items-center gap-1 px-2 py-1 text-xs bg-brand-100 text-brand-700 rounded hover:bg-brand-200 transition-colors disabled:opacity-50'>
                        {busy===index? <Loader2 className='size-3 animate-spin'/> : <Sparkle className='size-3'/>}
                        Enhance with AI
                    </button>
                </div>
                <textarea value={project.description || ""} onChange={(e)=>updateProject(index,'description',e.target.value)} rows={4} className='w-full text-sm px-3 py-2 rounded-lg resize-none' placeholder='Briefly describe what you built, the tech stack used, and the impact or outcome.'></textarea>
            </div>

            
        </div>
       ))}
    </div>)}
    </div>
  )
}

export default ProjectForm
