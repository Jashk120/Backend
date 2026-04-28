```javascript
import mongoose, {Schema, model} from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index:true
    },
    avatar:{
        type:String,
        required: true,
    },
    coverImage:{
        type: String,

    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type:String,
        required: [true, "Password is Required"]
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

/**
 * Hashes the user's password before saving to the database.
 *
 * @param next - The Mongoose middleware next function.
 * @returns {Promise<void>} A promise that resolves when the hashing is complete.
 */
userSchema.pre("save",async  function(next){
    if(!this.isModified("password")) return next() // used reverse logic so if the password is not modified or new password it wont keep hasing password

    this.password = await bcrypt.hash(this.password, 10)
    next
})

/**
 * Compares a plain text password with the user's hashed password.
 *
 * @param password - The plain text password to verify.
 * @returns {Promise<boolean>} A promise that resolves to whether the password matches.
 */
userSchema.methods.isPasswordCorrect = async function(password){
   await bcrypt.compare(password, this.password)
}

/**
 * Generates an access token JWT for the user.
 *
 * @returns {Promise<string>} A promise that resolves to the signed JWT access token.
 */
userSchema.methods.generateAccessToken = async function(){
   return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

/**
 * Generates a refresh token JWT for the user.
 *
 * @returns {Promise<string>} A promise that resolves to the signed JWT refresh token.
 */
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model("User", userSchema)
```