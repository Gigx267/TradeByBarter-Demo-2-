import { ErrorMiddlewareFunction } from "../types/types";
import { CustomError } from "./customError";
import { logger } from "../logger-configuration/envLogger";

const env = process.env.NODE_ENV || " ";

const validationError = (error: any) => {
    const validationErrorMessages = Object.values(error.errors).map((el: any) => {
        return el.properties.message;
    });
    const message = `Validation failed: ${validationErrorMessages.join(", ")}`;
    return new CustomError(message, 400);
};


const castError = (error: any) => {
    return new CustomError(`Invalid ID format`, 400);
};


const duplicateKeyError = (error: any) => {
    const duplicateField = Object.keys(error.keyValue)[0];
    const duplicateValue = Object.values(error.keyValue)[0];

    const message = `The value: ${duplicateValue} provided for the field: ${duplicateField} already exists try another email`;
    return new CustomError(message, 400);
};

const JWTTokenExpiredError = (error: any) => {
    const err = new CustomError("Session expired! Please log in again.", 401);
    return err
};

const JsonWebTokenError = (error: any) => {
    const err = new CustomError("Invalid token! Authentication failed.", 401)
    logger.info(err.message,JSON.stringify(err))
    return err
};

const globalErrorMiddleware: ErrorMiddlewareFunction = async (err, req, res, next) => {

    if (err.code === 11000) err = duplicateKeyError(err);
    else if (err.name == "ValidationError") err = validationError(err);
    else if (err.name == "CastError") err = castError(err);
    else if (err.name == "TokenExpiredError") err = JWTTokenExpiredError(err);
    else if (err.name == "JsonWebTokenError") err = JsonWebTokenError(err);

    const statusCode: number = err.statusCode || 500;
    const status: string = err.status || "error";

    const prodErrors = (err: any) => {
        if (err.isOperational) {

            logger.info(err.message, JSON.stringify(err));

            res.status(statusCode).json({
                status,
                message: err.message,
            });
        } else {
            logger.error(err.message, JSON.stringify(err));
           
            res.status(500).json({
                status: "error",
                message: "something went wrong, try again later!",
            });
        }
    };

    const devErrors = (err: any) => {
        
        logger.error(err.message,JSON.stringify(err))
        err.ip = undefined
        res.status(statusCode).json({
            status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    };

    if (env === "production") {
        prodErrors(err);
    } else if (env == "development") {
        devErrors(err);
    }
};

export { globalErrorMiddleware };
