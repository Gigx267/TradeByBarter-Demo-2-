import { userSchema } from "../schemas/userSchema";
import { ProductSchema } from "../schemas/productSchema";

import mongoose from "mongoose";

const UserModel = mongoose.model('User',userSchema);
const ProductModel = mongoose.model("Product", ProductSchema);


export {UserModel, ProductModel}



