import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FileText, Loader2, Lock, Mail, User } from 'lucide-react'
import api from '../configs/api'
import { logi } from '../app/features/authSlice'
import toast from 'react-hot-toast'

const Field = ({ icon: Icon, ...props }) => (
  <label className='relative block'>
    <Icon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' />
    <input {...props} required className='w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50' />
  </label>
)

const Login = () => {
  const urlState = new URLSearchParams(window.location.search).get('state')
  const [mode, setMode] = React.useState(urlState === 'signup' ? 'signup' : 'login')
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '' })
  const [busy, setBusy] = React.useState(false)
  const dispatch = useDispatch()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const submitHandle = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const { data } = await api.post(`/api/users/${mode}`, formData)
      localStorage.setItem('token', data.token)
      dispatch(logi({ token: data.token, user: data.user }))
      toast.success(data.message)
    } catch (err) {
      toast.error(err?.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Cannot reach the server. Is the backend running?' : err.message))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='min-h-screen grid place-items-center bg-ink px-4'>
      <div className='w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8'>
        <Link to='/' className='flex items-center justify-center gap-2 text-ink font-display font-semibold text-2xl mb-1'><FileText className='size-6' />ResumeStudio</Link>
        <h1 className='text-center font-display text-3xl font-medium mt-4'>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className='text-center text-sm text-slate-500 mt-1 mb-6'>{mode === 'login' ? 'Log in to continue building your resume' : 'Build an ATS-ready resume in minutes'}</p>

        <form onSubmit={submitHandle} className='space-y-4'>
          {mode === 'signup' && <Field icon={User} type='text' placeholder='Full name' name='name' value={formData.name} onChange={handleChange} />}
          <Field icon={Mail} type='email' placeholder='Email address' name='email' value={formData.email} onChange={handleChange} />
          <Field icon={Lock} type='password' placeholder='Password (min 6 characters)' name='password' value={formData.password} onChange={handleChange} minLength={6} />
          <button type='submit' disabled={busy} className='w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors'>
            {busy && <Loader2 className='size-4 animate-spin' />}{mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <p className='text-center text-sm text-slate-500 mt-6'>
          {mode === 'login' ? "Don't have an account?" : 'Already a member?'}{' '}
          <button className='text-brand-600 font-medium hover:underline' onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Sign up' : 'Log in'}</button>
        </p>
      </div>
    </div>
  )
}

export default Login
