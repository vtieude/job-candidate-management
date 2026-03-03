import { IsEmail, IsIn, IsString } from "class-validator";
import { UserRole } from "../../../common/enums";

export class CreateUserDto {
  password: string;
  @IsEmail()
  email: string;

  @IsIn([UserRole.Candidate, UserRole.Recruiter], {
    message: 'Role must be candidate or hr',
  })
  role: UserRole;
}

// crud
// create  => http method post
// read => http method get
// update => http method patch/put
// delete (soft , hard delete) => method delete

// fe => api BE  , debug