import cors from 'cors'
import express, { Application } from 'express'
const app: Application = express()

import usersRouter from './app/modules/users/users.route'
import globalErrorHandler from './app/middlewares/globalErrorHandler'

app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Application Routes
app.use('/api/v1/users/', usersRouter)

// app.get('/', async (req: Request, res: Response) => {
//   res.send('Working properly!')
// })

app.use(globalErrorHandler)

export default app
