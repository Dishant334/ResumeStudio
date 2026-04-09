import express from "express"
import cors from "cors"
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/airoutes.js";

const app=express();
const PORT= process.env.PORT || 3000

await connectDB()

app.use(express.json())  // used to read json data sent in request
app.use(cors())

app.get('/',(req,res)=>{
    res.send("server is live")
})
app.use('/api/users',userRouter)
app.use('/api/resumes',resumeRouter)
app.use('/api/ai',aiRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})