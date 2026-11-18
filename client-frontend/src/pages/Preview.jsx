import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import ResumePreview from '../components/ResumeBuilder/ResumePreview'
import { ArrowLeft, Download } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {
  const { resumeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/resumes/public/${resumeId}`)
        setResumeData(data.resume)
        document.title = data.resume.personal_info?.full_name ? `${data.resume.personal_info.full_name} - Resume` : data.resume.title
      } catch (err) {
        console.log(err?.message)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [resumeId])

  if (isLoading) return <Loader />
  if (!resumeData)
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <p className='text-5xl text-slate-400 font-medium'>Resume not found</p>
          <p className='text-slate-500 mt-2'>It may be private or deleted.</p>
          <a className='mt-6 inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white rounded-full px-6 h-10 transition-colors' href='/'>
            <ArrowLeft className='mr-2 size-4' />Go to home page
          </a>
        </div>
      </div>
    )

  return (
    <div className='bg-slate-100 min-h-screen print:bg-white'>
      <div className='max-w-4xl mx-auto py-8 px-3'>
        <div className='flex justify-end mb-3 print:hidden'>
          <button onClick={() => window.print()} className='flex items-center gap-2 px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700'><Download className='size-4' />Download PDF</button>
        </div>
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
      </div>
    </div>
  )
}

export default Preview
