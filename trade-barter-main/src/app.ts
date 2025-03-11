import express, { Response } from 'express'
import morgan from "./modules/utilities/morganConfig"
import userRouter from './modules/routes/userRouter'
import { globalErrorMiddleware } from "./modules/error-handling/globalErrorMiddleware"
import { unhandledRoutesHandler } from './modules/utilities/unhandledRoutes'
import { productRouter } from './modules/routes/productRouter'
import cookieParser from 'cookie-parser'
import path from 'path'
//http onl;y
const app = express()

app.use(morgan)

app.use(express.json());
app.use(cookieParser())

app.use(express.static(path.join(__dirname,'..','public')))


app.use('/api/v1', userRouter);
app.use('/api/v1', productRouter);

app.all('*', unhandledRoutesHandler);

app.use(globalErrorMiddleware);
export {app}

//FUTURE UPDATES

 //deny user access incase there was a recent change in password
//implement this after you make users able to update password in the future
//access and refresh tokens
//jwt blacklist
//a new jwt is always sent in cookie we need to limit it to 3
//add rate limit
// csurf
