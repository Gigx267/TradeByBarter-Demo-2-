import { CustomError } from '../error-handling/customError';
import { AuthenticatedUserOnRequestObject } from '../types/types';
import multer from 'multer'
import streamifier from 'streamifier'
import {v2 as cloudinary, UploadApiResponse, UploadResponseCallback} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const storage = multer.memoryStorage()
const upload = multer({storage})
const uploadMiddleware = upload.single('product-image')

const uploadToCloudinary = (req: AuthenticatedUserOnRequestObject ) => {
    return new Promise((resolve, reject) => {

        const writableStream = cloudinary.uploader.upload_stream(
            { folder: 'barter-trade-app',public_id:`barter_trade_app_${req?.user?._id}_${Date.now()}` },
            (err, response ) => {
                if (err) {
                    reject(err);
                }

                resolve(response);
            }
        );

        if (!req.file?.buffer) {
            throw new CustomError('File is required', 400);
        }

        streamifier.createReadStream(req.file?.buffer).pipe(writableStream);
    });
};

export { uploadToCloudinary,uploadMiddleware };
