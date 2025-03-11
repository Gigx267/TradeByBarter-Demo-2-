import morgan from 'morgan'
import  {format, transports, createLogger, Logger} from 'winston'
import { createLogFilePath } from './createLogPath'
import https from 'https'
import { httpsRequestOptions } from './httpsRequestOptions'
import { logger } from '../logger-configuration/envLogger'

const {combine, timestamp, json, printf} = format
const env = process.env.NODE_ENV || 'development'


const morganLoggerDev = createLogger({
  level : 'info',
  transports: [
    new transports.File({
      filename:createLogFilePath('http-requests')
    }),
    
  ],
  format:combine(
    timestamp(),
    json(),
    printf((info : any) => {
      const payload = JSON.stringify({level:info.level,message:info.message,httpRequest:true})
      const request = https.request(httpsRequestOptions,(res) => {
        let responseData = ''
        res.on('data',(chunk) => {
          responseData+=chunk
        })
      

      })
      request.write(payload)
      request.on('error',(err)=>{
        console.error(err.message,err)
      })
      request.end()
      console.log(info.message)
      return info.message
    })

  )
  
})

const morganLoggerProd = createLogger({
  level : 'info',
  transports: [
    new transports.File({
      filename:createLogFilePath('http-requests'),
      format:combine(
        timestamp(),
        json(),
        printf((info : any) => {
          const payload = JSON.stringify({level:info.level,message:info.message,httpRequest:true})
          const request = https.request(httpsRequestOptions,(res) => {
            let responseData = ''
            res.on('data',(chunk) => {
              responseData+=chunk
            })
          
    
          })
          request.write(payload)
          request.on('error',(err)=>{
            console.error(err.message,err)
          })
          request.end()
          console.log(`Log [${info.level}] recorded successfully.`);
          return info.message
        }))
      })
  
   
  ],
 
  
})

const morganLogger  = (() => {
  if (env === 'development'){
    return morganLoggerDev
  }

 else if (env === 'production'){
    return morganLoggerProd
  }
})()



const morganFunc = morgan(':method$:url$:status$:response-time ms$:date', {
    stream: { 
      write: async function (message) { 
        
        const ms = message.split('$');
        const obj = {
          method: ms[0],
          url: ms[1],
          status: ms[2],
          responseTime: ms[3],
          date: ms[4],
        };
        
        morganLogger?.log('info',message.split('$').join(' '))
      },
    },
  })

export default morganFunc