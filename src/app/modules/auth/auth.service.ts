/* eslint-disable no-console */
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { User } from '../user/user.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

// Creating Uses instance
const user = new User();

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  // Using instance methods
  const isUserExist = await user.isUserExist(id);
  const isPasswordMatched = await user.isPasswordMatched(
    password,
    isUserExist?.password
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password does not match');
  }

  const { id: userId, role, needsPasswordChange } = isUserExist;

  const accessToken = jwtHelper.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelper.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  // console.log({ accessToken, refreshToken, needsPasswordChange });
  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // invalid token - synchronous checking
  let verifiedToken: JwtPayload | null = null;
  try {
    verifiedToken = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    ) as unknown as JwtPayload;
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh token');
  }

  const { userId } = verifiedToken;

  const isUserExist = await user.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // generate new token
  const newAccessToken = jwtHelper.createToken(
    { id: isUserExist?.id, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
