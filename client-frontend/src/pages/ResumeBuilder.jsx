import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, Award, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOff, FileText, FolderIcon, GraduationCap, Loader2, Save, Share2, Sparkles, Trophy, User } from 'lucide-react'
import PersonalInfoForm from '../components/ResumeBuilder/PersonalInfoForm'
import ResumePreview from '../components/ResumeBuilder/ResumePreview'
import Summary from '../components/ResumeBuilder/Summary'
import Templatepicker from '../components/ResumeBuilder/Templatepicker'
import Colorpicker from '../components/ResumeBuilder/Colorpicker'
import ExperienceForm from '../components/ResumeBuilder/ExperienceForm'
import EducationForm from '../components/ResumeBuilder/EducationForm'
import ProjectForm from '../components/ResumeBuilder/ProjectForm'
import SkillForm from '../components/ResumeBuilder/SkillForm'
import ListForm from '../components/ResumeBuilder/ListForm'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'

const EMPTY = {
  _id: '', title: '', personal_info: {}, professional_summary: '', experience: [], education: [],
  project: [], skills: [], certifications: [], achievements: [], template: 'engineer', accent_color: '#3B82F6', public: false,
}

const sections = [
  { id: 'personal', name: 'Personal', icon: User },
  { id: 'summary', name: 'Summary', icon: FileText },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Sparkles },
  { id: 'project', name: 'Projects', icon: FolderIcon },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'certifications', name: 'Certs', icon: Award },
  { id: 'achievements', name: 'Awards', icon: Trophy },
]

const snapshot = (d) => JSON.stringify({ ...d, personal_info: { ...d.personal_info, image: typeof d.personal_info?.image === 'object' ? 'file' : d.personal_info?.image } })

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const auth = { headers: { Authorization: `Bearer ${token}` } }

  const [resumeData, setResumeData] = useState(EMPTY)
  const [saved, setSaved] = useState(snapshot(EMPTY))
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const dirty = loaded && snapshot(resumeData) !== saved

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, auth)
      if (data.resume) {
        const r = { ...EMPTY, ...data.resume, personal_info: data.resume.personal_info || {} }
        setResumeData(r)
        setSaved(snapshot(r))
        document.title = r.title
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => { if (token) loadExistingResume() }, [resumeId, token])

  // warn on tab close with unsaved edits, Ctrl/Cmd+S to save
  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    const keys = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); saveResume() } }
    window.addEventListener('beforeunload', warn)
    window.addEventListener('keydown', keys)
    return () => { window.removeEventListener('beforeunload', warn); window.removeEventListener('keydown', keys) }
  })

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify({ public: !resumeData.public }))
      const { data } = await api.put('/api/resumes/update', formData, auth)
      setResumeData((prev) => ({ ...prev, public: !prev.public }))
      setSaved((s) => JSON.stringify({ ...JSON.parse(s), public: !resumeData.public }))
      toast.success(resumeData.public ? 'Resume is now private' : 'Resume is now public')
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  const handleShare = async () => {
    const resumeUrl = `${window.location.origin}/view/${resumeId}`
    try {
      if (navigator.share) await navigator.share({ url: resumeUrl, text: 'My Resume' })
      else { await navigator.clipboard.writeText(resumeUrl); toast.success('Link copied to clipboard') }
    } catch { /* share cancelled */ }
  }

  const downloadResume = () => {
    if (dirty) toast('Tip: unsaved changes are included in the PDF, but remember to save', { icon: '💡' })
    const prev = document.title
    document.title = resumeData.personal_info?.full_name ? `${resumeData.personal_info.full_name} - Resume` : resumeData.title
    window.print()
    document.title = prev
  }

  const saveResume = async () => {
    if (saving || !loaded) return
    setSaving(true)
    try {
      const updated = structuredClone({ ...resumeData, personal_info: { ...resumeData.personal_info, image: undefined } })
      const img = resumeData.personal_info?.image
      const isFile = img && typeof img === 'object'
      if (!isFile) updated.personal_info.image = img || ''
      else delete updated.personal_info.image

      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(updated))
      if (isFile) formData.append('image', img)
      if (removeBackground) formData.append('removeBackground', 'yes')

      const { data } = await api.put('/api/resumes/update', formData, auth)
      const r = { ...EMPTY, ...data.resume }
      setResumeData(r)
      setSaved(snapshot(r))
      toast.success(data.message)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  const set = (key) => (value) => setResumeData((prev) => ({ ...prev, [key]: value }))
  const activeSection = sections[activeSectionIndex]
  const pct = useMemo(() => ((activeSectionIndex + 1) * 100) / sections.length, [activeSectionIndex])

  return (
    <div className='pb-10'>
      <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between print:hidden'>
        <Link to='/app' className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-800 transition-colors text-sm'>
          <ArrowLeftIcon className='size-4' />Back to Dashboard
        </Link>
        <span className={`text-xs px-2.5 py-1 rounded-full ${dirty ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {dirty ? 'Unsaved changes' : 'All changes saved'}
        </span>
      </div>

      <div className='max-w-7xl mx-auto px-4 print:p-0 print:max-w-none'>
        <div className='grid lg:grid-cols-12 gap-6 print:block'>
          {/* ---------- editor ---------- */}
          <div className='lg:col-span-5 print:hidden'>
            <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:sticky lg:top-4'>
              <div className='h-1 bg-slate-100'><div className='h-full bg-brand-500 transition-all duration-500' style={{ width: `${pct}%` }} /></div>

              <div className='flex items-center gap-2 p-3 border-b border-slate-100'>
                <Templatepicker selectedTemplate={resumeData.template} accentColor={resumeData.accent_color} onChange={set('template')} />
                <Colorpicker selectedColor={resumeData.accent_color} onChange={set('accent_color')} />
              </div>

              <div className='flex gap-1 overflow-x-auto px-3 pt-3'>
                {sections.map((s, i) => (
                  <button key={s.id} onClick={() => setActiveSectionIndex(i)} title={s.name}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${i === activeSectionIndex ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <s.icon className='size-3.5' />{s.name}
                  </button>
                ))}
              </div>

              <div className='p-5 space-y-6 max-h-[calc(100vh-17rem)] overflow-y-auto'>
                {activeSection.id === 'personal' && <PersonalInfoForm data={resumeData.personal_info} onChange={set('personal_info')} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />}
                {activeSection.id === 'summary' && <Summary data={resumeData.professional_summary} onChange={set('professional_summary')} setResumeData={setResumeData} />}
                {activeSection.id === 'education' && <EducationForm data={resumeData.education} onChange={set('education')} />}
                {activeSection.id === 'skills' && <SkillForm data={resumeData.skills} onChange={set('skills')} />}
                {activeSection.id === 'project' && <ProjectForm data={resumeData.project} onChange={set('project')} />}
                {activeSection.id === 'experience' && <ExperienceForm data={resumeData.experience} onChange={set('experience')} />}
                {activeSection.id === 'certifications' && <ListForm title='Certifications' hint='Courses & certificates (NPTEL, Coursera, AWS, Google…)' placeholder='e.g., AWS Cloud Practitioner – 2025' icon={Award} data={resumeData.certifications} onChange={set('certifications')} />}
                {activeSection.id === 'achievements' && <ListForm title='Achievements' hint='Hackathons, ranks, coding profiles, scholarships' placeholder='e.g., Smart India Hackathon 2024 – Finalist' icon={Trophy} data={resumeData.achievements} onChange={set('achievements')} />}
              </div>

              <div className='flex items-center justify-between gap-2 p-3 border-t border-slate-100 bg-slate-50'>
                <div className='flex gap-1'>
                  <button onClick={() => setActiveSectionIndex((i) => Math.max(i - 1, 0))} disabled={activeSectionIndex === 0} className='flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-white disabled:opacity-40'><ChevronLeft className='size-4' />Prev</button>
                  <button onClick={() => setActiveSectionIndex((i) => Math.min(i + 1, sections.length - 1))} disabled={activeSectionIndex === sections.length - 1} className='flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-white disabled:opacity-40'>Next<ChevronRight className='size-4' /></button>
                </div>
                <button onClick={saveResume} disabled={saving || !dirty} className='flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors'>
                  {saving ? <Loader2 className='size-4 animate-spin' /> : <Save className='size-4' />}Save
                </button>
              </div>
            </div>
          </div>

          {/* ---------- preview ---------- */}
          <div className='lg:col-span-7 min-w-0'>
            <div className='flex items-center justify-end gap-2 mb-3 print:hidden'>
              {resumeData.public && (
                <button onClick={handleShare} className='flex items-center px-4 py-2 gap-2 text-xs bg-brand-50 text-brand-700 rounded-lg ring-1 ring-brand-200 hover:bg-brand-100 transition-colors'><Share2 className='size-4' />Share</button>
              )}
              <button onClick={changeResumeVisibility} className='flex items-center px-4 py-2 gap-2 text-xs bg-slate-100 text-slate-700 rounded-lg ring-1 ring-slate-200 hover:bg-slate-200 transition-colors'>
                {resumeData.public ? <EyeIcon className='size-4' /> : <EyeOff className='size-4' />}{resumeData.public ? 'Public' : 'Private'}
              </button>
              <button onClick={downloadResume} className='flex items-center gap-2 px-5 py-2 text-xs bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors'><DownloadIcon className='size-4' />Download PDF</button>
            </div>
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
