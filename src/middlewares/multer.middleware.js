```javascript
import multer from "multer";

const storage = multer.diskStorage({
    /**
     * Sets the destination directory for the uploaded file.
     *
     * @param req - The Express request object.
     * @param file - The uploaded file object from multer.
     * @param cb - A callback to indicate where to store the file. It should be called with `null` (for no error) and the destination path string.
     */
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    /**
     * Generates the filename for the uploaded file.
     *
     * @param req - The Express request object.
     * @param file - The uploaded file object from multer.
     * @param cb - A callback to set the filename. It should be called with `null` (for no error) and the filename string.
     *
     * @remarks
     * Currently uses the original filename, which can lead to file overwrites. This is kept simple for the project.
     */
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname) // we should use something different thant original cause it acan overwrite the file, it is here to just keep project simple for now
      
    }
  })
  
 export const upload = multer({ 
    storage,
 })
```