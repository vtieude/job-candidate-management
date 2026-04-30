import { IsArray, IsEmail, IsIn, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../../common/enums";
import { Transform } from "class-transformer";

export class CreateUserDto {
  password!: string;
  @IsEmail()
  email!: string;

  @IsIn([UserRole.Candidate, UserRole.Recruiter], {
    message: 'Role must be candidate or hr',
  })
  role!: UserRole;
  
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value ?? []) 
  @IsString({ each: true })
  skills?: string[]; 
}
