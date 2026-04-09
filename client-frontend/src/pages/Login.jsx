import React from 'react'
import { useDispatch } from 'react-redux'
import api from '../configs/api'
import {logi} from '../app/features/authSlice'
import toast from 'react-hot-toast'

const Login = () => {
   const query=new URLSearchParams(window.location.search)
   const urlState=query.get('state')
  const [formData,setformData]=React.useState({
    name:"",
    email:"",
    password:""
  })
  const dispatch=useDispatch()

  const [login,setLogin]=React.useState(urlState || 'login')

  const handleChange=(e)=>{
    setformData({
      ...formData,[e.target.name]:e.target.value
    })
  }
  const submitHandle=async (e)=>{
    e.preventDefault()
    try{
      const{data}=await api.post(`/api/users/${login}`,formData)
      dispatch(logi({
        token:data.token, 
        user:data.user
      }))
      localStorage.setItem('token',data.token)
      toast.success(data.message)
    }catch(err){
      toast(err?.response?.data?.message || err.message)
    }
  }
  return (
    <div className='flex justify-center items-center bg-teal-950 h-screen w-screen'>
      <div className='w-96  bg-white border-4 border-slate-300 rounded-3xl '>
           
             <div>
              <h1 className='flex justify-center text-6xl'>{login==='login'?"Login":"Signup"}</h1>
              {login==='login'?
                <form action="" onSubmit={submitHandle} className='flex flex-col justify-center items-center gap-5 mt-12'>   
              <input  className='w-46 h-8 border-3 rounded-md border-amber-300'  type="email" placeholder='email' name="email" value={formData.email} onChange={handleChange}/>
              <input  className='w-46 h-8 border-3 rounded-md border-amber-300'  type="password" placeholder='password' name="password" value={formData.password} onChange={handleChange}/>
              <button type="submit" className='w-36 h-8 rounded-lg bg-purple-700'>Login</button>
             </form>
             
             :

               <form onSubmit={submitHandle} className='flex flex-col justify-center items-center gap-5 mt-12'>
              <input className='w-46 h-8 border-3 rounded-md border-amber-300' type="text" placeholder='name' name="name" value={formData.name} onChange={handleChange}/>
              <input  className='w-46 h-8 border-3 rounded-md border-amber-300'  type="email" placeholder='email' name="email" value={formData.email} onChange={handleChange}/>
              <input  className='w-46 h-8 border-3 rounded-md border-amber-300'  type="password" placeholder='password' name="password" value={formData.password} onChange={handleChange}/>
              <button type="submit" className='w-36 h-8 rounded-lg bg-purple-700'>Signup</button>
               </form>
              }
               <div className='flex gap-2  justify-center mt-12 mb-4'> 
              <h1>Not a Member?</h1> 
              <button className=' text-green-500 underline' onClick={()=>{setLogin(login==='login'? 'signup':'login')}}> {login==='login'? 'Signup' : 'Login'}</button>
              </div>
             </div>

      </div>
    </div>
  )
}

export default Login
