import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';

let server: Server;

// uncaughtException error handle
process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('🥭 DB connected');

    server = app.listen(config.port, () => {
      logger.info(`Listening on port ${config.port}`);
    });
  } catch (error) {
    errorLogger.error('Faild to connect', error);
  }

  // unhandledRejection error handle
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
bootstrap();

// Signel Termination error handle
process.on('SIGTERM', () => {
  logger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
