import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/apiError.js'
import  {User}  from '../modles/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/apiResponse.js'
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessandRereshToken = async(userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return{accessToken,refreshToken}

    }catch(error){
        throw new ApiError (500,"Something went wrong while Logging in")
    }
}
const registerUser = asyncHandler(async(req,res)=>{
    
    /* Steps
    //1.getting detils user from frontEnd
    //2.validation-not empty
    //3.check if user already exists
    //4.check for images, check for avatar
    //5.if images are avaliable upload them to cloudinary, check avatar
    //6.create user object - create entry in db
    //7.remove password and refreshtoken field from response
    //8.check if got respone, and for user creation
    //9.if yes return response , else sent error */

    
        // step 1
    const {email, password, username, fullname } = req.body
    console.log(req.files)
    
      
        
    
    //Step 2
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
        ) { //checking if any of the field is empyty if yes return true
        throw new ApiError(400, "All Fields are Required")
    }
    //step 3
    const existingUser = await User.findOne({
        $or:[{ username } , { email }]
    })
    if (existingUser){
        throw new ApiError(409, "User Already exist")
    }
    //Step 4
    const avatarLocaPath = req.files?.avatar[0]?.path;  //always use ?(optionl, maybe we got file maybe not)
    const coverImageLocalPath =req.files?.coverImage[0]?.path
    
    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }

    //checking if avatar is uploaded cause that is necessary
    if (!avatarLocaPath) {
        throw new ApiError(400, "avatar file is required")
    }
    console.log(avatarLocaPath,coverImageLocalPath);
    // Step 5 uploading
    const avatar = await uploadOnCloudinary(avatarLocaPath)
    const coverImage = await uploadOnCloudinary (coverImageLocalPath)

    // checking if avatar is present or it will tear the database
    if (!avatar) {
        throw new ApiError(400, "avatar file is required")
    }

    //Step 6 making entry in database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // we have checked that avatar is present but havent checked CoverImage, so if it is not present, keep the field empty
        email,
        password,
        username: username.toLowerCase()
    })
    //checking if user is successfully created
    //Step 7 removing password and refreshtoken field from response using . select
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Somethin Went Wrong While Regestiring the user")
    }

return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
)
})
    
const loginUser = asyncHandler (async (req,res)=>{
    //req.body data
    //check username and email is present or not
    // find the user in database
    // check password (error incorrect password )
    // access and refresh Token
    // send cookies (success response)

    // Step 1:
    const {email, username, password} = req.body
    console.log(req.body)

    // Step 2:
    if (!(username || email)) {
            throw new ApiError(400, "username or email is required")
            
        }
    const user = await User.findOne({
        $or: [{username}, {email}] // $or is mongoDB aggeration function, it searched give me uername or email
    })
    if(!user){
        throw new ApiError(404,"User dose not exist")
    }
    const ispasswordValid = await user.isPasswordCorrect(password)

    if(!ispasswordValid){
        throw new ApiError(401,"Invalid Password")
    }

    const {accessToken, refreshToken} = await 
    generateAccessandRereshToken(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return req
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json (
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken, refreshToken
            },
            "Logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            },

        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{}, "User Logged Out"))
})
const refreshAccessToken = asyncHandler(async (req,res)=>{
const incomingRefreshToken = req.cookies.
    refreshToken||req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError (401, "Unauthorized Request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh Token")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh Token Is Expired or Used")
        }
    
        const  options = {
            httpOnly: true,
            secure: true
        }
           const {accessToken,newrefreshToken}=await generateAccessandRereshToken(user._id)
    
           return res
           .status(200)
           .cookie("accessToken", accessToken,options)
           .cookie("refreshToken",newrefreshToken,options)
           .json(
                new ApiResponse(
                    200,
                    {accessToken, refreshToken:newrefreshToken, },
                    "AccessToken Refreshed Successfully"
                )
           )
    } catch (error) {
        
    }
})
export {registerUser, logoutUser, loginUser}