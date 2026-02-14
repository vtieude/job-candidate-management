import { UserRole } from '../enums';

export class BaseUserDto {
  email: string;
  role: UserRole;
}

export class UserPayloadRequest extends BaseUserDto {
  userId: string;
}
