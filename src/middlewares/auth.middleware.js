```javascript
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../modles/user.models.js";

/**
 * Middleware function to verify JWT (JSON Web Token) authentication.
 * 
 * This middleware extracts the access token from the request cookies or Authorization header,
 * verifies it using the secret key, fetches the corresponding user from the database,
 * and attaches the user object (excluding password and refreshToken) to the request object.
 * If authentication fails at any step, it throws an ApiError with a 401 status code.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 * @throws {ApiError} If no token is provided, the token is invalid, or the user is not found.
 */
export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401, "Unautrorized Request")
        }
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select(
            "-password - refreshToken"
        )
    
        if(!user){
            throw new ApiError (401,"Invaild Access Token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid AccessToken")
    }
})
```