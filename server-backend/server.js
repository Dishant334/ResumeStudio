import express from "express"
import cors from "cors"
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/airoutes.js";

const app = express();
const PORT = process.env.PORT || 3000

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in server-backend/.env")
  process.exit(1)
}

await connectDB()

app.use(express.json({ limit: "2mb" }))
const origins = (process.env.CLIENT_URL || "").split(",").map(s => s.trim()).filter(Boolean)
app.use(cors(origins.length ? { origin: origins } : undefined))

app.get('/', (req, res) => { res.send("server is live") })
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)

// error handler (multer errors, bad JSON, ...)
app.use((err, req, res, next) => {
  const status = err.status || (err.name === 'MulterError' ? 400 : 500)
  res.status(status).json({ message: err.message || "Something went wrong" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
