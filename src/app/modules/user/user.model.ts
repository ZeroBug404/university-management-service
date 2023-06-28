/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser, IUserMethods, UserModel } from './user.interface';

const UserSchema = new Schema<IUser, Record<string, never>, IUserMethods>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.method(
  'isUserExist',
  async function isUserExist(id: string): Promise<Partial<IUser> | null> {
    const user = await User.findOne(
      { id },
      { id: 1, password: 1, needsPasswordChange: 1, role: 1 }
    );

    return user;
  }
);

UserSchema.method(
  'isPasswordMatched',
  async function isPasswordMatched(
    givenPassword: string,
    savePassword: string | undefined = ''
  ): Promise<boolean | null> {
    const isMatched = await bcrypt.compare(givenPassword, savePassword);

    return isMatched;
  }
);

//! Hasing the password
UserSchema.pre('save', async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
