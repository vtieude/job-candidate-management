import { Get, Route, Tags, Post, Body, Request, Security } from 'tsoa';
import * as userService from '../services/user.service'
import { IUser } from '../schema/user.schema';
import { UserRequest } from '../inputs/user.input';
import { Constants } from '../configs/constant';
import { HttpError } from '../utils/httpError';
import { comparePassword, generateToken } from '../utils/jwt';
import * as express from 'express';
import { UserProfile } from '../middlewares/auth.middleware';

@Route('users')
@Tags('Users')
@Security(Constants.SecurityMethod.JWT)
export class UserController {
  @Get('/')
  public async getAllUsers(): Promise<IUser[]> {
    return await userService.getAllUser();
  }

  @Get('/me')
  public async getProfile( @Request() req: express.Request): Promise<IUser | null> {
    const userProfile = (req as any).user as UserProfile;
    return await userService.findUserByEmail(userProfile.email);
  }

  @Security(Constants.SecurityMethod.PUBLIC)
  @Post('/register')
  public async register(@Body() body: UserRequest): Promise<IUser> {
    return await userService.createUser(body);
  }

  @Security(Constants.SecurityMethod.PUBLIC)
  @Post('/login')
  public async login(@Body() body: UserRequest): Promise<string> {
    const user = await userService.findUserByEmail(body.email);
    if (!user) {
      throw new HttpError(Constants.HttpStatus.NOT_FOUND, 'User not found');
    }
    if (await comparePassword(body.password ,user.password)) {
      return generateToken({ email: body.email, id: user._id as string })
    }
    throw new HttpError(Constants.HttpStatus.UNAUTHORIZED, 'User not found');
  }
}
