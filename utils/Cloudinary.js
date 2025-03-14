// following an approach. we don't upload file directly to cloudinary 
// first to local server with help of multer and then local server to cloudinary server... (as followed in industry)
// in fs we "unlink" instead of "delete"

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { config } from 'dotenv';
config({ path: "../config/config.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("Local file path is missing.");
        }
        const response = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type: 'auto',
            })
        //file has been uploaded successfully
        // now we have to remove it from local storage
        // fs.unlinkSync(localFilePath);


        // Delete file from local storage after successful upload
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("Failed to delete local file after successful upload:", err.message);
            } else {
                console.log("File successfully deleted from local storage:", localFilePath);
            }
        });



        // console.log(response.url);
        return response;
    } catch (error) {
        // fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload operation got failed
        // return null;

        console.error("Cloudinary upload failed:", error.message);

        // Delete the file from local storage if upload fails
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("Failed to delete local file after Cloudinary upload failure:", err.message);
            } else {
                console.log("Local file deleted after Cloudinary upload failure:", localFilePath);
            }
        });

        throw error; // Re-throw the error for further handling
    }
}

export { uploadOnCloudinary };