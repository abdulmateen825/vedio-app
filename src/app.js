import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"


const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json({
    limit: "16kb"
}))
app.use(express.json({
    extended: true , limit : "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

//routes imports
import userRoute from "./routes/user.route.js"


// routes declaration 
app.use("/api/v1/user" , userRoute)


export {app}