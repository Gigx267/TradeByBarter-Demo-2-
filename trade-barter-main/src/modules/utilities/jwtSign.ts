import jwt, { SignOptions } from 'jsonwebtoken'
import { ObjectId } from 'mongoose';

const secret = process.env.JWT_SECRET as string ;
const JWTExpiresIn = process.env.JWT_EXPIRES_IN as  SignOptions['expiresIn'] 

const jwtSign = (payload : {id:string}) => {
    return jwt.sign(payload, secret,{expiresIn:JWTExpiresIn  });
}

export {jwtSign}