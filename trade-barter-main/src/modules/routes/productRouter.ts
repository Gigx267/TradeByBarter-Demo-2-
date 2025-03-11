import express from 'express';
import { Protect } from '../controllers/authController';
import { CreateProduct, GetAllProducts, GetProduct, UpdateProduct, DeleteProduct } from '../controllers/productController';
import { uploadMiddleware } from '../utilities/cloudinary';
import { uploadImage } from '../controllers/productController';

const productRouter = express.Router()

productRouter.post("/upload/:id", Protect,uploadMiddleware,uploadImage);

productRouter
    .route("/products")
    .get(Protect, GetAllProducts)
    .post(Protect,CreateProduct);


productRouter
    .route("/products/:id")
    .get(Protect,GetProduct)
    .patch(Protect,UpdateProduct)
    .delete(Protect,DeleteProduct);

export  {productRouter};
