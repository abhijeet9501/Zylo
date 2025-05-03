import {v2 as cloudinary} from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import "dotenv/config";

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET, 
});

const file = fileURLToPath(import.meta.url);
const dirname = path.dirname(file);
const __dir = path.dirname(dirname);

const uploadOnCloudinary = async (filePath) => {
    try {
       if (!filePath) return null;
       const upload = await cloudinary.uploader
       .upload(filePath, 
        {
            resource_type: "auto",
            crop: "thumb",       
            gravity: "face",     
            width: 300,          
            height: 300
        });

        fs.unlink(path.join(__dir, filePath), (e) => {
            if (e) {console.log(e)};
        }); 
        return upload;
    }catch (err) {
        fs.unlink(path.join(__dir, filePath), (e) => {
            if (e) {console.log(e)};
        });  
        return null;
    };
};

const deleteUpload = async (public_id) => {
    return  await cloudinary.uploader.destroy(public_id);
};

export { 
    uploadOnCloudinary,
    deleteUpload,
}