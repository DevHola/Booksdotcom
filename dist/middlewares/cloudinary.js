"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.cloudinaryImageUploadMethod = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const multerStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (!fs_1.default.existsSync('./uploads')) {
            fs_1.default.mkdirSync('./uploads');
        }
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${Date.now()}.${ext}`);
    },
});
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
});
const cloudinaryImageUploadMethod = async (filesarray, foldername) => {
    try {
        const urls = [];
        let files;
        files = filesarray;
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            folder: foldername
        };
        for (const file of files) {
            const data = await cloudinary_1.v2.uploader.upload(file.path, options);
            fs_1.default.unlink(file.path, (err) => {
                if (err) {
                    throw new Error('Failed to delete local file');
                }
            });
            urls.push(data.secure_url);
        }
        return urls;
    }
    catch (error) {
        throw new Error('Error uploading to Cloudinary');
    }
};
exports.cloudinaryImageUploadMethod = cloudinaryImageUploadMethod;
exports.upload = (0, multer_1.default)({ storage: multerStorage });
