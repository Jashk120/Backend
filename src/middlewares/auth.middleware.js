import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../modles/user.models.js";

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