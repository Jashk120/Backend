```javascript
/**
 * Represents a standardized API response object.
 * 
 * @class ApiResponse
 */
class ApiResponse {
    /**
     * Creates an instance of ApiResponse.
     * 
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {*} data - The response data payload.
     * @param {string} [message="Success"] - A human-readable message describing the response.
     */
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400 // <400 beacause its API Response, if it more we should use APiError
    }
}

export { ApiResponse }
```