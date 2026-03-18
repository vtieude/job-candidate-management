import { Types } from "mongoose";
import { UserRole } from "../../../common/enums";
import { User } from "../schemas/user.schema";
import { ApiHideProperty } from "@nestjs/swagger";

export class UserDto implements User {
  @ApiHideProperty()
  password: string;
  email: string;
  role: UserRole;
  active: boolean;
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
