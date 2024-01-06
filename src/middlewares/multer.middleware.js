import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname) // we should use something different thant original cause it acan overwrite the file, it is here to just keep project simple for now
      
    }
  })
  
 export const upload = multer({ 
    storage,
 })
 