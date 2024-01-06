import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB= async () => {
    try{
        const connectionInstance= 
        await mongoose.connect(`${process.env.
            MONGODB_URI}/${DB_NAME}`)
        console.log(`${connectionInstance}\n MongoDB Connected!! DB_Host:${connectionInstance.connection.host} `);
    }catch(error){
        console.log("MongoDN connection Error:", error);
        process.exit(1)
    }
}

export default connectDB