import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
  name:'auth',
  initialState: {
    token:null,
    user:null,
    loading:true
  },
  reducers : {
    logi: (state,action)=>{
        state.token=action.payload.token
        state.user=action.payload.user
    },
    logout:(state)=>{
        state.token=''
        state.user=null
        localStorage.removeItem('token')
    },
    setLoading:(state,action)=>{
        state.loading=action.payload 
    }

  }
})

export const {logi,logout,setLoading}=authSlice.actions
export default  authSlice.reducer