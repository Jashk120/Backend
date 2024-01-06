import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential:true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended: true, limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
import userRouter from './routes/user.routes.js'

app.use("/api/v1/users",userRouter) //http://localhoast:4000/api/vi/users/register
export {app}