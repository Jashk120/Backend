```javascript
/**
 * Wraps an asynchronous request handler to catch any errors and pass them to the error-handling middleware.
 *
 * @param requestHandler - The asynchronous route handler function.
 * @returns A new function that executes the request handler and catches any errors using `next(err)`.
 */
const asyncHandler =(requestHandler)=>{
    return  (req,res,next)=>{
       Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
    
}

export {asyncHandler}
```