import { BriefcaseBusiness, Github, Globe, Linkedin, Mail, MapPin, Phone, User, User2 } from 'lucide-react'
import React from 'react'
import { useState } from 'react'

const PersonalInfoForm = ({data,onChange,removeBackground,setRemoveBackground}) => {
  const handleChange=(name,value)=>{
      onChange({...data,[name]:value})
  }

  const fields=[
    {key:"full_name",label:"Full Name",icon:User2,type:"text",required:true},
    {key:"email",label:"Email Address",icon:Mail,type:"email",required:true},
    {key:"phone" ,label:"Phone Number",icon:Phone,type:"tel"},
    {key:"location",label:"Location",icon:MapPin,type:"text"},
    {key:"profession",label:"Profession",icon:BriefcaseBusiness,type:"text"},
    {key:"linkedin",label:"LinkedIn Profile",icon:Linkedin,type:"text"},
    {key:"github",label:"GitHub Profile",icon:Github,type:"text"},
    {key:"website",label:"Portfolio / Website",icon:Globe,type:"text"},
  ]
  return (
    <div>
      <h2 className='text-lg font-semibold text-gray-900'>Personal Information</h2>
      <p className='text-sm text-gray-600'>Get Started with the personal information</p>
     <div className='flex items-center gap-2'>
      <label htmlFor="profile-picture">
        {data.image ? (<img src={typeof data.image==='string'? data.image: URL.createObjectURL(data.image)} alt='user-image' className='w-16 h-16 rounded-full
         object-cover mt-5 ring ring-slate-300 hover:opacity-80'></img>):
         <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'><User className='size-10 p-2.5 border rounded-full'/>Upload User Image</div>
         }
         <input id='profile-picture' type="file" accept='image/png,image/jpeg,image/webp' className='hidden' onChange={(e)=>e.target.files[0] && handleChange("image",e.target.files[0])}/>
      </label>
      {data.image && typeof data.image==='object' && (
        <div className='flex flex-cols gap-1 pl-4 text-sm'>
        <p>Remove Background</p>
 <label className="inline-flex items-center cursor-pointer gap-3">
  <input
    type="checkbox"
    className="sr-only"
    checked={removeBackground}
    onChange={(e) => setRemoveBackground(e.target.checked)}
  />

  <div
    className={`relative w-9 h-5 rounded-full transition-colors duration-200
      ${removeBackground ? 'bg-green-600' : 'bg-slate-300'}`}
  >
    <span
      className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full
        transition-transform duration-200 ease-in-out
        ${removeBackground ? 'translate-x-4' : ''}`}
    />
  </div>
</label>
  

        </div>
      )}

     </div>
   {fields.map((field) => {
  return (
    <div key={field.key} className='space-y-1 mt-5'>
      <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
        <field.icon className='size-4'/>
        {field.label}
        {field.required && <span className="text-red-600">*</span>}
      </label>

      <input
        type={field.type}
        value={data[field.key] || ''}   // ✅ use personal_info
        onChange={(e)=>handleChange(field.key, e.target.value)}
        className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-brand-500 outline-none transition-colors text-sm'
        placeholder={`Enter your ${field.label.toLowerCase()}`}
        required={field.required}
      />
    </div>
  )
})}

     

    </div>
  )
}

export default PersonalInfoForm

