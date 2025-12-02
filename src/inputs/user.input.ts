// src/models/User.ts
import { IsEmail, MinLength } from "class-validator";
import { RoleEnum } from "../configs/enum";

export class UserRequest {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

}

export class RegisterUserRequest extends UserRequest{
  role: RoleEnum = RoleEnum.Candidate;
}