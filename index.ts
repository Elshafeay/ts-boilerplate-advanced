import app from './app';
import { checkingEnvVariables } from './config/checking-env-variables';
import { dbManagerInstance } from './config/DBManager';
import Logger from './src/middlewares/logger';

const start = async() => {
  checkingEnvVariables();
  await dbManagerInstance.testConnection();

  app.listen(3000, () => Logger.info('Listening on port 3000!'));
};

start();