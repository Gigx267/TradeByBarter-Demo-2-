import { CustomError } from "../error-handling/customError";
import { RegularMiddlewareFunction } from "../types/types";

const unhandledRoutesHandler : RegularMiddlewareFunction = async (req, res, next) => {
    next(new CustomError(`The path ${req.originalUrl} does not exist!`, 404));
  }

export {unhandledRoutesHandler}