```markdown
# Backend Application — `Jashk120/Backend`

## Architecture Overview

This is a Node.js/Express backend providing a RESTful API for a video‑sharing platform.  
It follows a layered architecture with routes, controllers, models, middleware, and utility modules.  
MongoDB (via Mongoose) is used as the primary database, Cloudinary for file storage, and JWT for authentication.

## Modules / Folder Structure

```
src/
├── app.js                     # Express app setup (CORS, JSON, cookies, static files)
├── constants.js               # DB_NAME constant ("VidoeDB")
├── controllers/
│   └── user.controller.js     # User registration, login, logout, token refresh
├── db/
│   └── index.js               # MongoDB connection logic
├── index.js                   # Entry point (dotenv, DB connect, start server)
├── middlewares/
│   ├── auth.middleware.js      # JWT verification (verifyJWT)
│   └── multer.middleware.js    # File upload handling (Multer storage)
├── models/
│   ├── user.models.js         # User schema (password hashing, JWT generation)
│   └── video.models.js        # Video schema (with pagination plugin)
├── routes/
│   └── user.routes.js         # Routes for /register, /login, /logout
└── utils/
    ├── apiError.js            # Custom ApiError class
    ├── apiResponse.js         # Standardised ApiResponse class
    ├── asyncHandler.js        # Async error‑catcher wrapper
    └── cloudinary.js          # Cloudinary upload utility

Different Approaches/          # Legacy / alternative implementations (not part of main source)
├── asyncHandler.js            # Alternative error handler (commented out)
└── Connecting dataBase 1.js   # Alternative DB connection pattern
```

## Setup Assumptions

- Environment variables are required (loaded from `./env`):  
  `PORT`, `MONGODB_URI`, `CORS_ORIGIN`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`,  
  `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- MongoDB instance must be accessible at the provided URI.
- Cloudinary account is needed for file (avatar, cover image) uploads.
- A `public/temp` directory exists for temporary local file storage before Cloudinary upload.
- The database name used is `"VidoeDB"` (defined in `src/constants.js`).

## Key Flows

### 1. User Registration (`POST /api/v1/users/register`)
- Accepts multipart form‑data with fields: `fullname`, `email`, `username`, `password`, `avatar` (required), `coverImage` (optional).
- Validates fields, checks uniqueness of username/email.
- Uploads avatar (and optionally coverImage) to Cloudinary via `uploadOnCloudinary`.
- Creates a new `User` document in MongoDB.
- Returns a 201 response with user data (excluding password and refreshToken).

### 2. User Login (`POST /api/v1/users/login`)
- Accepts JSON body with `email` or `username` and `password`.
- Finds user, validates password (hashed with bcrypt).
- Generates access and refresh tokens via `generateAccessandRereshToken`.
- Sets tokens as HTTP‑only secure cookies and returns them in the response body.

### 3. User Logout (`POST /api/v1/users/logout`)
- Requires authentication (`verifyJWT` middleware).
- Sets the user’s `refreshToken` to `undefined` in the database.
- Clears the access and refresh token cookies.

### 4. Token Refresh (not yet exposed as a separate route; logic exists in `user.controller.js`)
- Extracts refresh token from cookies or request body.
- Verifies JWT, checks token against stored user token.
- Generates new access and refresh tokens, updates cookie.

### 5. Authentication Middleware (`verifyJWT`)
- Extracts token from `cookies.accessToken` or `Authorization: Bearer <token>`.
- Verifies with `ACCESS_TOKEN_SECRET`.
- Fetches user from DB (excluding password and refreshToken) and attaches to `req.user`.
- Throws 401 on failure.

## Notable Interfaces

### Classes / Constructors

- **`ApiError(statusCode, message, errors, stack)`**  
  Custom error extending `Error`. Contains `statusCode`, `message`, `success: false`, `errors[]`.

- **`ApiResponse(statusCode, data, message)`**  
  Standard success response. Contains `statusCode`, `data`, `message`, `success` (true if statusCode < 400).

### Utility Functions

- **`asyncHandler(requestHandler)`**  
  Wraps an async route handler and forwards any thrown errors to the next middleware.

- **`uploadOnCloudinary(localFilePath)`**  
  Uploads a file to Cloudinary with `resource_type: "auto"`. Deletes the local file afterwards. Returns Cloudinary response or `null`.

- **`generateAccessandRefreshToken(userId)`**  
  Generates both tokens, saves the refresh token to the user document, returns `{accessToken, refreshToken}`.

### Model Methods (User)

- **`userSchema.pre("save")`** — Hashes password before saving (only if modified).
- **`userSchema.methods.isPasswordCorrect(password)`** — Compares plain text with stored hash.
- **`userSchema.methods.generateAccessToken()`** — Signs JWT with `_id`, `email`, `username`, `fullname`.
- **`userSchema.methods.generateRefreshToken()`** — Signs JWT with only `_id`.

### Middleware

- **`upload.fields([{name: "avatar"}, {name: "coverImage"}])`** (Multer) — Accepts up to 1 file per field.
- **`verifyJWT`** — Protects routes requiring authentication.

## Notes

- The `Video` model is defined but not yet used in any controller – only schema structure is provided.
- The `Different Approaches` folder contains alternative implementations (e.g., connecting to DB inside an IIFE) and is not part of the active source.
```