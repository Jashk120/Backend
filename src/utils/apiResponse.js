class ApiResponse {
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400 // <400 beacause its API Response, if it more we should use APiError
    }
}

export { ApiResponse }