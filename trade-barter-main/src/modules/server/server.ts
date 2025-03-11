import mongoose from 'mongoose';
import '../schemowares/middlewares/userMiddleware'

import '../utilities/envValidator'
import { app } from "../../app";
import '../utilities/envValidator'


import { logger } from '../logger-configuration/envLogger';

const environment = process.env.NODE_ENV || 'development'
const connectionString = process.env.DB_CONNECTION_STRING || ''
console.log({environment})


const server = app.listen(3000,() => {
    console.log('Server running on port 3000')
})


process.on('unhandledRejection',(err : any)=>{
    server.close(()=>{
        logger.error('Unhandled Rejection shutting down application!\n',{stack:err.stack,...err})
       
    })
})
process.on('uncaughtException',(err : any)=>{
    console.log({error:err})
    server.close(()=>{
        logger.error('Uncaught Exception shutting down application!\n',{stack:err.stack,...err})
        process.exit(1)
    })
})

const dbConnect = async (url:string) => {
    await mongoose.connect(url)
    console.log('connection to remote database successful')

}
    
dbConnect(connectionString)
.catch(err => logger.error(err.message,err))


export {server}

