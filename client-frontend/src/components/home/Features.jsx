import React from 'react'
import Title from './Title'

const Features = () => {
  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
      <Title title="Build your resume" description="Our streamlined process helps you create a professional resume in minutes with AI-powered tool and features"/>
      <h1 className="text-3xl font-semibold text-center mx-auto">
        Powerful Resume Builder Features
      </h1>
      
      <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
        Build professional, ATS-friendly resumes with AI assistance, live preview, and instant downloads.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-10 mt-16">

        {/* Feature 1 */}
        <div className="max-w-80 hover:-translate-y-1 transition duration-300">
          <img
            className="rounded-xl object-cover h-48 w-full"
            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
            alt="Live Resume Preview"
          />
          <h3 className="text-base font-semibold text-slate-700 mt-4">
            Live Resume Preview
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Instantly preview your resume as you edit with AI-powered suggestions and formatting.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="max-w-80 hover:-translate-y-1 transition duration-300">
          <img
            className="rounded-xl object-cover h-48 w-full"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Share Resume Link"
          />
          <h3 className="text-base font-semibold text-slate-700 mt-4">
            Shareable Resume Link
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Create a live resume link and share it instantly with recruiters and hiring managers.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="max-w-80 hover:-translate-y-1 transition duration-300">
          <img
            className="rounded-xl object-cover h-48 w-full"
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            alt="Download Resume"
          />
          <h3 className="text-base font-semibold text-slate-700 mt-4">
            Download in Multiple Formats
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Download your resume in PDF or DOCX format, optimized for ATS systems.
          </p>
        </div>

      </div>
      <br />
      <br />
    </div>
  )
}


export default Features
