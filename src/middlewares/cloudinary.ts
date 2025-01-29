import multer from 'multer'
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads')
    }
      cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1]
      cb(null, `${Date.now()}.${ext}`)
  },
})

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET
})

export const cloudinaryImageUploadMethod = async (filesarray: any, foldername: string): Promise<String[]> => {
  try {
    const urls = []
  
    let files: any
    files =  filesarray
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: foldername
      };
    for (const file of files) {
        const data = await cloudinary.uploader.upload(file.path, options)
        fs.unlink(file.path, (err) => {
            if (err) {
              throw new Error('Failed to delete local file');
            }
          });
        urls.push(data.secure_url)
    }
    return urls as String[]
  } catch (error) {
    throw new Error('Error uploading to Cloudinary')
  }
}

export const upload = multer({ storage: multerStorage })
