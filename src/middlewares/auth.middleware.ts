import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import jwt from "jsonwebtoken";
import { Constants } from '../configs/constant';
import { HttpError } from '../utils/httpError';
import { IAuthPayload } from '../interfaces';


export const expressAuthentication = async (request: Request,
  securityName: string,
  _scopes?: string[]): Promise<IAuthPayload | null> => {
  if (securityName === Constants.SecurityMethod.PUBLIC) {
    return null; // allow public access
  }

  if (securityName === Constants.SecurityMethod.JWT) {
    const authHeader = request.headers.authorization; // lower-case headers
    if (!authHeader) throw new HttpError(Constants.HttpStatus.UNAUTHORIZED, 'No token provided');
    // remove "Bearer " prefix
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    if (!token) {
      throw new HttpError(Constants.HttpStatus.UNAUTHORIZED, 'No token provided')
    }
    let decoded: IAuthPayload;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
    // If scopes are defined in the route, check role
    if (_scopes && _scopes.length > 0 && !_scopes.includes(decoded.role)) {
      throw new Error('Forbidden: Insufficient role');
    }
    (request as any).user = decoded;
    return decoded; // this gets injected into controller methods if you add a param
  }
  throw new Error("Unsupported security method");
}