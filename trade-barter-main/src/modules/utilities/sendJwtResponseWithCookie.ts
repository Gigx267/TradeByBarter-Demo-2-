import { Response } from "express";
import { User } from "../types/types";
import mongoose from "mongoose";

const env = process.env.NODE_ENV || 'development'

const sendJwtResponseWithCookie = (res : Response,token : string,user : any) => {

    res.cookie('jwt_token',token,{
        httpOnly:true,
        sameSite:"strict",
        secure : env === 'production' ? true : false, 
        expires : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    })

    res.status(200).json({status:'success',user })
}

export {sendJwtResponseWithCookie}