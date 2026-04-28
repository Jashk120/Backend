```javascript
/**
 * Represents a custom error class extending the built-in Error class, 
 * commonly used for API error handling with additional status code and error details.
 *
 * @class ApiError
 * @extends Error
 */
class ApiError extends Error{
    /**
     * Creates an instance of ApiError.
     *
     * @param {number} statusCode - HTTP status code for the error.
     * @param {string} [message=" Something Went Wrong"] - Human-readable error message.
     * @param {Array} [errors=[]] - Array of specific error details.
     * @param {string} [stack=""] - Custom stack trace string. If empty, stack trace is captured automatically.
     */
    constructor(
        statusCode,
        message= " Something Went Wrong",
        errors=[],
        stack=""
    ){
        super(message),
        this.statusCode=statusCode
        this.data= null
        this.message=message
        this.success= false
        this.errors=errors
    
        if(stack){
            this.stack
        }else{
            Error.captureStackTrace(this.constructor)
        }

    }ErrorCaptureStackTrace
}

export {ApiError}
```