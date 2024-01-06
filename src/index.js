import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path: './env'
})
const port = process.env.PORT || 3000

connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("Error:", error);
        throw error
    })
    app.listen(port, ()=>{
        console.log(`Listening to Port: ${port}\n Link: http://localhost:${port}`);
    })
})
.catch((error)=>{
    console.log("MongoDB Connection Error:", error);
})