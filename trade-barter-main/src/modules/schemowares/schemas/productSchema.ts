import mongoose from "mongoose";
import { ProductSchema } from "../../types/types";
import validator from 'validator'

const ProductSchema = new mongoose.Schema<ProductSchema>(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => value.length >= 3,
        message: "Product name must be at least 3 characters long",
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => value.length >= 10,
        message: "Description must be at least 10 characters long",
      },
    },
    seller:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    sellerPhoneNumber:{
      type:String,
      required:true,
      maxlength:[20,"Seller's Phone Number Can't be higher than 20 characters"],
      minlength:[7,"Seller's Phone Number Can't be lower than 7 characters"],
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => value > 0,
        message: "Price must be greater than zero",
      },
    },
    image: {
      type: String,
      required: true,
      trim: true,
      default:'https://res.cloudinary.com/dyosqrywo/image/upload/v1741184833/DALL_E_2025-03-05_14.26.41_-_A_minimalistic_default_product_image_with_a_neutral_gray_background_and_a_centered_outline_of_a_box_or_package._The_design_should_be_clean_and_modern_jqdia6.webp'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    }
  }
);

export { ProductSchema };
