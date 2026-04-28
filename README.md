```markdown
# Backend Application — Video Sharing Platform

## Overview

This is a Node.js/Express backend that provides a RESTful API for a video‑sharing platform. It follows a layered architecture with routes, controllers, models, middleware, and utility modules. MongoDB (via Mongoose) serves as the primary database, Cloudinary handles file storage, and JWT manages authentication.

## Features

- **User Registration** – Create an account with a required avatar and optional cover image.
- **User Login** – Authenticate using email/username and password, receive access and refresh tokens.
- **User Logout** – Invalidate tokens and clear HTTP‑only cookies.
- **Token Refresh** – Obtain new tokens using a valid refresh token (logic available, not yet exposed as a route).
- **Authentication Middleware** – Protect routes with JWT verification (via `verifyJWT`).
- **Standardised Error & Success Responses** – `ApiError` and `ApiResponse` classes ensure consistent API output.
- **Async Error Handling** – `asyncHandler` wrapper eliminates try‑catch boilerplate.
- **Cloudinary Upload** – Automatic file upload and temporary file cleanup.
- **Password Security** – Passwords hashed with bcrypt before storage.

## File Structure

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

## Usage

### 1. User Registration (`POST /api/v1/users/register`)

**File:** `src/routes/user.routes.js` and `src/controllers/user.controller.js`

```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -F "fullname=John Doe" \
  -F "email=johndoe@example.com" \
  -F "username=johndoe" \
  -F "password=securePass123" \
  -F "avatar=@/path/to/avatar.jpg" \
  -F "coverImage=@/path/to/cover.jpg"
```

- **Required fields:** `fullname`, `email`, `username`, `password`, `avatar`.
- **Optional field:** `coverImage`.
- **Response (201):** Returns the created user object (without password and refreshToken).

### 2. User Login (`POST /api/v1/users/login`)

```bash
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "johndoe@example.com",
    "password": "securePass123"
  }'
```

- Provide either `email` or `username` together with `password`.
- **Response (200):** Returns access and refresh tokens both in HTTP‑only cookies and in the response body.

### 3. User Logout (`POST /api/v1/users/logout`)

```bash
curl -X POST http://localhost:8000/api/v1/users/logout \
  -H "Authorization: Bearer <access_token>" \
  -b "accessToken=<access_token>; refreshToken=<refresh_token>"
```

- Requires a valid JWT access token (in cookie or Authorization header).
- **Response (200):** Clears cookies and sets the user’s refreshToken to `undefined` in the database.

### 4. Using the `asyncHandler` Utility

**File:** `src/utils/asyncHandler.js`

```javascript
import asyncHandler from "./utils/asyncHandler.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});
```

- Wraps any async route handler and forwards uncaught errors to the next error‑handling middleware.

### 5. Creating a User Programmatically (Model Example)

**File:** `src/models/user.models.js`

```javascript
import User from "./models/user.models.js";

const newUser = new User({
  fullname: "Jane Smith",
  email: "jane@example.com",
  username: "janesmith",
  password: "myPassword", // will be hashed by the pre-save hook
  avatar: "http://res.cloudinary.com/.../avatar.jpg",
});

await newUser.save();
console.log(newUser); // password and refreshToken are not exposed by default
```

### 6. Protecting a Route with `verifyJWT` Middleware

**File:** `src/middlewares/auth.middleware.js`

```javascript
import { verifyJWT } from "./middlewares/auth.middleware.js";

router.get("/profile", verifyJWT, async (req, res) => {
  res.status(200).json(req.user);
});
```

- `verifyJWT` extracts and verifies the token, then attaches `req.user` (user document without password/refreshToken).

### 7. Uploading a File to Cloudinary

**File:** `src/utils/cloudinary.js`

```javascript
import { uploadOnCloudinary } from "./utils/cloudinary.js";

const localPath = "./public/temp/tempfile.jpg";
const result = await uploadOnCloudinary(localPath);
if (result) {
  console.log("Cloudinary URL:", result.url);
} else {
  console.log("Upload failed");
}
```

- Takes a local file path, uploads to Cloudinary, deletes the local file, and returns the Cloudinary response object.

## Setup

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- Cloudinary account
- Environment variables (see below)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jashk120/Backend.git
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_access_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Ensure the `public/temp` directory exists (used for temporary file storage before Cloudinary upload):
   ```bash
   mkdir -p public/temp
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Notes

- The `Video` model is defined but not yet used in any controller – only the schema structure is provided.
- The `Different Approaches` folder contains alternative implementations (e.g., connecting to DB inside an IIFE) and is **not** part of the active source code.
- The token refresh logic exists in `user.controller.js` but has **not** been exposed as a separate route. You can add a `POST /refresh-token` endpoint using that logic.
- The database name used is `"VidoeDB"` (defined in `src/constants.js`). Ensure your MongoDB URI points to a valid instance where this database can be created.
- Cookies are set as HTTP‑only and secure by default; adjust for local development if needed.
```