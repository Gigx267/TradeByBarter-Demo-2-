import path from 'path'

const createLogFilePath = (filename: string) => {
    return path.join(__dirname, '..', '..', '..', `logs/${filename}.log`);
  };

  
  export {createLogFilePath}