```javascript
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

/**
 * Establishes a connection to the MongoDB database using the URI from environment variables and the database name.
 *
 * Connects to the database and logs the host of the successful connection. If the connection fails, the error is logged
 * and the Node.js process exits with code 1.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 * @throws Will exit the process if the connection fails.
 */
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
```