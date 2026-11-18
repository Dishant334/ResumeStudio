import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, LogOut } from 'lucide-react'
import { logout } from '../app/features/authSlice'

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logoutUser = () => {
    navigate('/')
    dispatch(logout())
  }
  return (
    <div className='bg-white border-b border-slate-200 print:hidden'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3'>
        <Link to='/app' className='flex items-center gap-2 text-xl font-display font-semibold text-ink'><FileText className='size-6' />ResumeStudio</Link>
        <div className='flex items-center gap-3 text-sm'>
          <p className='max-sm:hidden text-slate-600'>Hi, {user?.name}</p>
          <button onClick={logoutUser} className='flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-full active:scale-95 transition-all'><LogOut className='size-4' />Logout</button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
