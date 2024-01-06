import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //uploading File on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{ 
            resource_type: "auto"
        }, 
        function(error, result) {console.log(result); });
        console.log("Successfully uploaded file on cloudinary link:",response.url)
        console.log(response)
        return response;
    }catch (error) {
        fs.unlinkSync(localFilePath) // Removing the local save file which was uploaded, and got failed
        return null;
    }
}
export {uploadOnCloudinary}




