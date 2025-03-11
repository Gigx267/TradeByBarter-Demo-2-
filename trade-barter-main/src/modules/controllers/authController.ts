import { NextFunction, Response } from "express";
import {  JwtProtectMiddlewarePayload, RegularMiddlewareFunction,AuthenticatedUserOnRequestObject} from "../types/types";
import { UserModel } from "../schemowares/models/models";
import { asyncErrorHandler } from "../error-handling/asyncErrorHandler";
import { logger } from "../logger-configuration/envLogger";
import { CustomError } from "../error-handling/customError";
import { jwtSign } from "../utilities/jwtSign";
import { sendJwtResponseWithCookie } from "../utilities/sendJwtResponseWithCookie";
import { checkLoginAttemptLimit } from "../helpers/checkLoginAttemptLimit";
import jwt from "jsonwebtoken";

const env = process.env.NODE_ENV || 'development'

const SignUp : RegularMiddlewareFunction = asyncErrorHandler(async (req,res,next) => {
    const {name, email, password, passwordConfirm } = req.body
    
    if (!name || !email || !password || !passwordConfirm) {
        return next(new CustomError("All fields are required.", 400));
    }

    const userDetails = {
        name,
        email, 
        password, 
        passwordConfirm
    }
    
    const user = await UserModel.create(userDetails)

  
    const token = jwtSign({id:`${user._id}`})

    const ip = req.headers['x-forwarded-for'] || req.ip;
    logger.info(`User ${user.name} - ${user.email} - with ID: ${user._id} has successfully created an account`,{newAccount:true,ip})

    sendJwtResponseWithCookie(res,token,{_id:user._id,name:user.name})

})

const Login : RegularMiddlewareFunction = asyncErrorHandler(async (req,res,next) => {
    const userIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip;
    const userAgent = req.headers['user-agent'];
    //implement blacklisted jwt
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new CustomError("Email and password are required.", 400));
    }
  
    const user = await UserModel.findOne({email}).select('+password')

    if (!user || !await user.correctPassword(password, user.password)) {
    logger.info("Invalid login attempt", { userIp, userAgent });
    return next(new CustomError("Invalid Credentials! Authentication failed.", 401));
}

    checkLoginAttemptLimit(user)
    const token = jwtSign({id:`${user._id}`})

    logger.info(`A User has successfully logged in into his account`)
    
    user.lastLoginAt = new Date(Date.now());
    user.successfulLoginCount = Number(user.successfulLoginCount) + 1
    
    await user.save({validateBeforeSave:false})
    sendJwtResponseWithCookie(res,token,{_id:user._id,name:user.name})
})


const Protect = asyncErrorHandler(async (req: AuthenticatedUserOnRequestObject,res: Response,next: NextFunction) => {
    const token = req.cookies.jwt_token;

    if (!process.env.JWT_SECRET) throw new CustomError("JWT secret is not configured.", 500);


    if (!token) {
        return next(new CustomError("Token is missing.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtProtectMiddlewarePayload;

    if (!decoded) {
        return next(new CustomError("Invalid token. Authentication failed.", 401));
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
        return next(new CustomError("User not found.", 404));
    }

    // Deny user access in case there was a recent change in password
    // Implement this after you make users able to update password in the future
    req.user = user;

    next();
});

const Logout: RegularMiddlewareFunction = asyncErrorHandler(async (req, res, next) => {
    res.clearCookie("jwt_token", {
        httpOnly: true,
        sameSite: "strict", 
        secure: env === "production",
    });

    logger.info(`User with ID: ${req.user?._id} has logged out`);

    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
});


export {SignUp, Login, Protect,Logout}