const cloudinary = require('cloudinary').v2;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage })


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const uploadToCloudinary = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            `data:image/jpeg;base64,${fileBuffer.toString('base64')}`,
            { folder: "blog" },
            (error, result) => {
                if (error) return reject(error);
                console.log(result)
                resolve(result);
            }
        )
    })
}




module.exports = { uploadToCloudinary, upload };