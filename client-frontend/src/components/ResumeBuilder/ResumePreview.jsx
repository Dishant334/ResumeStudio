import React, { useEffect, useRef, useState } from 'react'
import { getTemplate } from '../templates/registry'
import ExtraSections from '../templates/shared/ExtraSections'

const PAGE_WIDTH = 794 // A4 @96dpi

// legacy templates don't know about project.tech – fold it into the description
const withTech = (data) => ({
  ...data,
  project: (data.project || []).map((p) => ({
    ...p,
    description: [p.tech && `Tech: ${p.tech}`, p.description].filter(Boolean).join('\n'),
  })),
})

const ResumePreview = ({ data, template, accentColor, classes = '', fit = true }) => {
  const wrapRef = useRef(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!fit || !wrapRef.current) return
    const el = wrapRef.current
    const update = () => setZoom(Math.min(1, el.clientWidth / PAGE_WIDTH))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fit])

  const t = getTemplate(template)
  const Template = t.Component

  return (
    <div ref={wrapRef} className='w-full'>
      <div
        id='resume-preview'
        className={`resume-page bg-white shadow-lg ring-1 ring-black/5 ${classes}`}
        style={fit ? { width: PAGE_WIDTH, zoom } : undefined}
      >
        <Template data={t.legacy ? withTech(data) : data} accentColor={accentColor} />
        {t.legacy && <ExtraSections data={data} accentColor={accentColor} />}
      </div>
    </div>
  )
}

export default ResumePreview
