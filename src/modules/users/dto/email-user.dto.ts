import { ApiProperty } from "@nestjs/swagger";

export class UserEmailDto {
  email: string;
  role: string;
}