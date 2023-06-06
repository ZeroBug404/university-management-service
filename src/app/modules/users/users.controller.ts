import { RequestHandler } from 'express'
import userServices from './users.service'

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body

    const result = await userServices.createUser(user)

    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: result,
    })
  } catch (err) {
    // res.status(400).json({
    //   // success: false,
    //   // message: 'Faild to create user',
    //   error: err
    // })
    next(err)
  }
}

export default {
  createUser,
}
