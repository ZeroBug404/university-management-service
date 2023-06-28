/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();

import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import cookieParser from 'cookie-parser';

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/', routes);

//Testing
// app.get('/', (req: Request, res: Response, next) => {
//   //   throw new ApiError(400, 'Oma new error')
//   //   Promise.reject(new Error('Unhandle promise rejection'))
//   //   res.send('Working properly!')
// })

app.use(globalErrorHandler);

//? Handle not fount route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

// const academicSemester = {
//   code: '01',
//   year: '2025',
// };
// const testId = async () => {
//   const testId = await generateFacultyId();
//   console.log(testId);
// };
// testId()

export default app;
