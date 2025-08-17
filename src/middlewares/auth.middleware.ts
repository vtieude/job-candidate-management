import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import jwt from "jsonwebtoken";
import { Constants } from '../configs/constant';
import { HttpError } from '../utils/httpError';

export class UserProfile {
  id!: string;
  email!: string;
}


export const expressAuthentication = async (request: Request,
  securityName: string,
  _scopes?: string[]): Promise<UserProfile | null>  => {
    if (securityName === 'public') {
      return null; // allow public access
    }
    
    if (securityName === "jwt") {
      const authHeader = request.headers.authorization; // lower-case headers
      if (!authHeader) throw new HttpError(Constants.HttpStatus.UNAUTHORIZED, 'No token provided');
      // remove "Bearer " prefix
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader; 
      if (!token) {
        throw new HttpError(Constants.HttpStatus.UNAUTHORIZED, 'No token provided')
      }

      try {
        const decoded = verifyToken(token) as UserProfile;
        (request as any).user = decoded;
        return decoded; // this gets injected into controller methods if you add a param
      } catch (err) {
        throw new Error("Invalid or expired token");
      }
    }
    throw new Error("Unsupported security method");
}