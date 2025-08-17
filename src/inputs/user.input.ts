// src/models/User.ts
import { IsEmail, MinLength } from "class-validator";

export class UserRequest {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}