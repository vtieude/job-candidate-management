import jwt from 'jsonwebtoken';
import config from '../configs';
import { Constants } from '../configs/constant';
import { IAuthPayload } from '../interfaces';
import bcrypt from 'bcryptjs';


export const generateToken = (payload: IAuthPayload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: Constants.Auth.ExpiresIn, });
}

export const comparePassword = async (inputPassword: string, passwordHash: string) => {
  return await bcrypt.compare(inputPassword, passwordHash);
}

export const verifyToken = (token: string): IAuthPayload  => {
  return jwt.verify(token, config.jwtSecret) as IAuthPayload;
}