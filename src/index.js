```javascript
import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path: './env'
})
const port = process.env.PORT || 3000

connectDB()
.then(/**
 * Callback invoked when the database connection is established.
 * Sets up error handling for the app and starts the HTTP server.
 * @returns {void}
 */
()=>{
    /**
     * Handles errors emitted by the app instance.
     * @param {Error} error - The error object.
     * @throws Will re-throw the error after logging.
     */
    app.on("error", (error)=>{
        console.log("Error:", error);
        throw error
    })
    /**
     * Callback invoked when the server starts listening.
     * Logs the server URL to the console.
     * @returns {void}
     */
    app.listen(port, ()=>{
        console.log(`Listening to Port: ${port}\n Link: http://localhost:${port}`);
    })
})
.catch(/**
 * Callback invoked when the database connection fails.
 * Logs the error message to the console.
 * @param {Error} error - The connection error.
 * @returns {void}
 */
(error)=>{
    console.log("MongoDB Connection Error:", error);
})
```