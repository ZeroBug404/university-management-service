/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cors from 'cors';
import express, { Application } from 'express';
const app: Application = express();

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application Routes
// app.use('/api/v1/users/', UserRoutes)
// app.use('/api/v1/academic-semesters/', AcademicSemesterRoutes)

app.use('/api/v1/', routes);

//Testing
// app.get('/', (req: Request, res: Response, next) => {
//   //   throw new ApiError(400, 'Oma new error')
//   //   Promise.reject(new Error('Unhandle promise rejection'))
//   //   res.send('Working properly!')
// })

app.use(globalErrorHandler);

export default app;
