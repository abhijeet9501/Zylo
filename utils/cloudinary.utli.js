import {v2 as cloudinary} from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import "dotenv/config";

cloudinary.config({ 
    cloud_name: 'dufkkffxd', 
    api_key: '363626323963312', 
    api_secret: '5kBiHZGqOhg5KEsm2kmLOHKx9sE' 
});

const file = fileURLToPath(import.meta.url);
const dir = path.dirname(file);
const __dir = path.dirname(dir);

const uploadOnCloudinary = async (filePath) => {
    try {
       if (!filePath) return null;
       const upload = await cloudinary.uploader
       .upload(filePath, 
        {
            resource_type: "auto",
        });

        fs.unlink(path.join(__dir, filePath), (e) => {
            if (e) {console.log(e)};
        }); 
        return upload.secure_url;
    }catch (err) {
        fs.unlink(path.join(__dir, filePath), (e) => {
            if (e) {console.log(e)};
        });  
        return null;
    };
};

export default uploadOnCloudinary;