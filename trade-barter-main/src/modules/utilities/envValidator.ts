const requiredEnvVars = ["NODE_ENV","JWT_SECRET","DB_CONNECTION_STRING","LOGGING_HOSTNAME","LOGGING_PATHNAME","JWT_EXPIRES_IN","CLOUDINARY_CLOUD_NAME","CLOUDINARY_API_KEY","CLOUDINARY_API_SECRET"];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) throw new Error(`Missing environment variable: ${envVar}`);
});
