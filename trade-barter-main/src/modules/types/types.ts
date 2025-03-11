import { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";


interface AuthenticatedUserOnRequestObject extends Request {
    user? : {
        _id:mongoose.Types.ObjectId,
        name:string,
        email:string,
        role:string,
        lastLoginAt?:Date,
        successfulLoginCount?:number|Number

    },

    }


type RegularMiddlewareFunction = (req:AuthenticatedUserOnRequestObject,res:Response,next:NextFunction) => Promise<any>
type ErrorMiddlewareFunction = (err:any,req:Request,res:Response,next:NextFunction) => Promise<any>

interface SignupEmailRecipientPayload {
    name:string,
    email:string
}

interface NodeMailerOptions {
    subject : string,
    user : SignupEmailRecipientPayload,
    message : string
}

interface UserSchema {
    name:string,
    email:string,
    role:string,
    password:string,
    passwordConfirm:string | undefined,
    isVerified:boolean,
    hashedSignupToken:string | undefined,
    hashedSignupTokenExpires:Date | undefined,
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>,
    lastLoginAt:Date,
    successfulLoginCount:Number,
    


}

interface User {
    _id:mongoose.Types.ObjectId,
    name:string,
    email:string,
    role:string,
    lastLoginAt:Date,
    successfulLoginCount : number | Number
    }

interface HttpPostRequestOptions {
    hostname: string | undefined;
    path: string | undefined;
    method: string;
    headers: {
      'Content-Type': string;
    };
  }

type JWTVerifyTokenFunction = (token: string, secret: string) => Promise<any>;
interface JwtProtectMiddlewarePayload  {
    id:string,
    iat:number,
    exp:number
    
}

interface ProductSchema {
  _id:mongoose.Schema.Types.ObjectId,
  productName:string,
  description:string,
  seller:mongoose.Schema.Types.ObjectId,
  price:Number,
  image:string,
  createdAt:Date,
  hasDefaultImage:Boolean,
  sellerPhoneNumber:String


}


export {
    RegularMiddlewareFunction,
    UserSchema,
    User,
    ErrorMiddlewareFunction,
    NodeMailerOptions,
    SignupEmailRecipientPayload,
    HttpPostRequestOptions,
    JWTVerifyTokenFunction,
    JwtProtectMiddlewarePayload,
    AuthenticatedUserOnRequestObject,
    ProductSchema,
    
    

}