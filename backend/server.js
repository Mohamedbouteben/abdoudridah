import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import connectDB from "./config/mongoose.js"
import userrouter from "./routes/userRoutes.js"
import workerrouter from "./routes/workerRoutes.js"
import reportrouter from "./routes/Reportroutes.js"

const app = express()
app.use(express.json())
app.use(cors())
connectDB()

app.use("/uploads", express.static("uploads"))

app.use("/api/users", userrouter)
app.use("/api/workers", workerrouter)
app.use("/api/reports", reportrouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})