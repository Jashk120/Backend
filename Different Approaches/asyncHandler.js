/**
 * Wraps an asynchronous route handler to catch errors and send a standardized JSON error response.
 *
 * @param fn - The async route handler function to be wrapped.
 * @returns A middleware function that executes the handler and catches errors.
 */
// const asyncHandler = (fn)=> async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }catch(error){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }