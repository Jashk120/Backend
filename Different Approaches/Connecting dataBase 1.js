```javascript
// First Approch, Second is better
import express from "express";

const app = express();
const port = process.env.PORT;

/**
 * Immediately-invoked async function expression that initializes the Express server with MongoDB.
 *
 * - Connects to the database using Mongoose.
 * - Handles connection errors via the Express `error` event.
 * - Starts listening on the configured port.
 *
 * @returns {Promise<void>} A promise that resolves when the server starts successfully.
 * @throws {Error} If the database connection fails or an error occurs during startup.
 */
;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/DB_NAME`);
        /**
         * Event listener for Express application errors.
         *
         * @param {Error} error - The error object emitted by the application.
         * @throws {Error} Rethrows the error after logging it.
         */
        app.on("error", (error) => {
            console.log("Err", error);
            throw error;
        });

        /**
         * Callback invoked when the server starts listening on the configured port.
         *
         * Logs a message indicating the port the server is running on.
         */
        app.listen(port, () => {
            console.log(`listening on port${port}`);
        });
    } catch (error) {
        console.error("error", error);
        throw err; // Note: 'err' is not defined; likely intended to be 'error'
    }
})(); // the 2 brackets are used so the program is executed fast; the first bracket is an arrow and the second is used to execute
```