import axios from 'axios'

const api= axios.create({
    baseURL:import.meta.env.PROD ? "https://resumestudio-tnr7.onrender.com" : (import.meta.env.VITE_BASE_URL || "http://localhost:3000")
})

export default  api