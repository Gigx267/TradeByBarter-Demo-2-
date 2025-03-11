import { asyncErrorHandler } from "../error-handling/asyncErrorHandler";
import { CustomError } from "../error-handling/customError";
import { RegularMiddlewareFunction } from "../types/types";
import { ProductModel, UserModel } from "../schemowares/models/models";
import { uploadToCloudinary } from "../utilities/cloudinary";
import { UploadApiResponse } from "cloudinary";
import {logger} from '../logger-configuration/envLogger'


const CreateProduct = asyncErrorHandler(async (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    
    const productDetails = {
        productName: req.body.productName,
        description: req.body.description,
        price: req.body.price,
        seller: req.user?._id,
        sellerPhoneNumber:req.body.sellerPhoneNumber
    };

    const newProduct = await ProductModel.create(productDetails);
    const link = `${req.protocol}://${req.get('host')}/api/v1/upload/${newProduct._id}`;

    logger.info(`Product created`, { userId: req.user?._id, productId: newProduct._id, ip });

    res.status(201).json({
        status: 'success',
        link
    });
});

const uploadImage = asyncErrorHandler(async (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const response = await uploadToCloudinary(req) as UploadApiResponse;

    logger.info(`Image uploaded`, { userId: req.user?._id, productId: req.params.id, ip });

    const userProductAwaitingImageUpload = await ProductModel.findById(req.params.id);
    userProductAwaitingImageUpload!.image = response.secure_url;
    await userProductAwaitingImageUpload!.save({ validateBeforeSave: false });

    res.status(201).json({
        status: 'success',
        message: 'Image Uploaded Successfully!'
    });
});

const GetAllProducts: RegularMiddlewareFunction = asyncErrorHandler(async (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    
    const products = await ProductModel.find().populate('seller', 'name');

    logger.info(`Fetched all products`, { userId: req.user?._id, totalProducts: products.length, ip });

    res.status(200).json({ status: "success", products });
});


const GetProduct: RegularMiddlewareFunction = asyncErrorHandler(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
        return next(new CustomError("Product not found", 404));
    }

    res.status(200).json({ status: "success", product });
});


const UpdateProduct: RegularMiddlewareFunction = asyncErrorHandler(async (req, res, next) => {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!product) {
        return next(new CustomError("Product not found", 404));
    }

    res.status(200).json({ status: "success", product });
});


const DeleteProduct: RegularMiddlewareFunction = asyncErrorHandler(async (req, res, next) => {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(new CustomError("Product not found", 404));
    }

    res.status(204).json({ status: "success", message: "Product deleted successfully" });
});



export { CreateProduct, GetAllProducts, GetProduct, UpdateProduct, DeleteProduct,uploadImage };
