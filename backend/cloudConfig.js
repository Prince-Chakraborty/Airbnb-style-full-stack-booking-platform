const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Hardcoded credentials (replace with your actual Cloudinary info)
cloudinary.config({
    cloud_name: "dskesqxgr",       // replace with your Cloudinary cloud name
    api_key: "114328182441581",             // replace with your Cloudinary API key
    api_secret: "CLK6k7QKpo_a9Ltq8Fx4wfYK5ms",       // replace with your Cloudinary API secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ["png", "jpg", "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};
