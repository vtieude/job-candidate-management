import jwt from 'jsonwebtoken';
import config from '../configs';
import { Constants } from '../configs/constant';
import { IAuthPayload } from '../interfaces';
import bcrypt from 'bcryptjs';


export const generateToken = (payload: IAuthPayload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: Constants.Auth.ExpiresIn, });
}

export const comparePassword = (inputPassword: string, passwordHash: string) => {
  return bcrypt.compare(inputPassword, passwordHash);
}

export const verifyToken = (token: string)  => {
  return jwt.verify(token, config.jwtSecret);
}