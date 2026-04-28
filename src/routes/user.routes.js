```javascript
/**
 * Express router module for user-related routes.
 * 
 * Defines the following endpoints:
 * - POST /register – Registers a new user with optional avatar and cover image uploads.
 * - POST /login – Authenticates a user and returns tokens.
 * - POST /logout – Logs out the current user (requires authentication).
 */
import { Router } from "express";
import {loginUser, logoutUser, registerUser} from "../controllers/user.controller.js"
import {upload} from '../middlewares/multer.middleware.js'
import  {verifyJWT}  from "../middlewares/auth.middleware.js";

const router = Router()

/**
 * Route: POST /register
 * 
 * Registers a new user. Expects multipart/form-data containing:
 * - "avatar" (image, optional)
 * - "coverImage" (image, optional)
 * Allowed file counts are limited to one per field.
 * After file upload handling, the request is passed to `registerUser` controller.
 */
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
    )

/**
 * Route: POST /login
 * 
 * Authenticates a user using credentials (e.g., email/username and password).
 * No middleware required; delegates to `loginUser` controller.
 */
router.route("/login").post(loginUser)

//secured Routes
/**
 * Route: POST /logout
 * 
 * Logs out the authenticated user. Requires a valid JWT token (handled by `verifyJWT` middleware).
 * After verification, the request is passed to `logoutUser` controller.
 */
router.route("/logout").post(verifyJWT,logoutUser)

export default router
```