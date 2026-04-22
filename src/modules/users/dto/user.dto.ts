import { Types } from "mongoose";
import { UserRole } from "../../../common/enums";
import { User, UserLevel } from "../schemas/user.schema";
import { ApiHideProperty } from "@nestjs/swagger";

export class UserDto implements User {
  @ApiHideProperty()
  password!: string;
  email!: string;
  role!: UserRole;
  active!: boolean;
  skills?: string[];
  _id!: Types.ObjectId;
  fullName?: string;
  phone?: string;

  level?: UserLevel;
  createdAt!: Date;
  updatedAt!: Date;
}
