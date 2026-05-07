import {v2 as cloudinary} from 'cloudinary';
import { response } from 'express';
import fs from 'fs';
const uploadtocloudinry = async (file) =>{
    try {
        if(!file) return null
        //upload file
        cloudinary.uploader.upload(file , {
            resource_type: "auto"
        })
        //file uploaded successfuly
        return response

        
    } catch (error) {
        fs.unlinkSync(file) // remove the temporary file from server
        return null
    }
}



 cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

export {uploadtocloudinry}