import https from 'https';
import winston, { format, transports } from 'winston';
import { httpsRequestOptions } from '../utilities/httpsRequestOptions';
const { errors, combine, json, printf, prettyPrint, timestamp } = format;
import { createLogFilePath } from '../utilities/createLogPath';

const devLogger = winston.createLogger({
  level: 'debug',
  transports: [
    new transports.Console({
      format: combine(
        errors({ stack: true }),
        timestamp(),
        prettyPrint(),
        printf((info: any) => {
          const timestamp = new Date(info.timestamp).getTime();
          info.timestamp = timestamp;
          const logPayload = JSON.stringify({ message: info.message, ...info });
          const request = https.request(httpsRequestOptions, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
              responseData += chunk;
            });
          });
          request.write(logPayload);
          request.on('error', (err) => {
            console.error(err.message, err);
          });
          request.end();
          return `${info.level} - ${info.message}`;
        })
      ),
    }),
    new transports.File({
      filename: createLogFilePath('app'),
      format: combine(errors({ stack: true }), json()),
    }),
  ],
});

devLogger.on('error', (err) => {
  console.error(err);
});

const prodLogConfig = winston.createLogger({
  level: 'info',
  transports: [
    new transports.File({
      filename: createLogFilePath('app'),
      format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
        printf((info: any) => {
          const timestamp = new Date(info.timestamp).getTime();
          info.timestamp = timestamp;
          const logPayload = JSON.stringify({ message: info.message, ...info });
          const request = https.request(httpsRequestOptions, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
              responseData += chunk;
            });
          });
          request.write(logPayload);
          request.on('error', (err) => {
            console.error(err.message, err);
          });
          request.end();
          console.log(`Log [${info.level}] recorded successfully.`);
          return logPayload;
        })
      ),
    }),
  ],
});

const defineProdLogLevel = (level: 'info' | 'error' | 'debug' | 'warn') => 
(message: string, metadata?: any) => 
{ prodLogConfig.log(level, message, { payload: metadata })};


const prodLogger = {
  info: defineProdLogLevel('info'),
  error: defineProdLogLevel('error'),
  warn: defineProdLogLevel('warn'),
  debug: defineProdLogLevel('debug'),
};

prodLogConfig.on('error', (err) => {
  console.error(err);
});

const env = process.env.NODE_ENV || ' ';

const logger = (() => {
  if (env == 'development') {
    return devLogger;
  } else if (env == 'production') {
    return prodLogger;
  } else {
    throw new Error('unknown environment');
  }
})();

export { logger };
