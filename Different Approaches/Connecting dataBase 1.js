/* First Approch, Second is better
import express from "express";


const app= express()
const port =process.env.PORT

;(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/DB_NAME`)
        app.on("error", (error)=>{
            console.log("Err", error)
            throw error
        })

        app.listen(port, () =>{
            console.log(`listening on port${port}`)
        })

    }catch(error){
        console.error("error",error)
        throw err
    }
}) () // the 2 brackets are use so the program is executed fast, the first bracked is a arrow and the second is used to execute
*/