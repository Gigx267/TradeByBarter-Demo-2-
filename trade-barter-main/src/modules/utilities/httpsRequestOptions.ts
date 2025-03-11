import { HttpPostRequestOptions } from "../types/types";

let httpsRequestOptions: HttpPostRequestOptions ;

if (process.env.LOGGING_HOSTNAME && process.env.LOGGING_PATHNAME) {
  httpsRequestOptions = {
    hostname: process.env.LOGGING_HOSTNAME,
    path: process.env.LOGGING_PATHNAME,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
} else {
  console.log("Logging pathname and hostname not found");
}

export { httpsRequestOptions };
