import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

// router.get('/:id', FacultyController.getSingleFaculty);

// router.patch(
//   '/:id',
//   validateRequest(FacultyValidation.updateFacultyZodSchema),
//   FacultyController.updateFaculty
// );

// router.delete('/:id', FacultyController.deleteFaculty);

export const AuthRoutes = router;
