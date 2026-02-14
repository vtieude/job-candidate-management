// auth/dto/login.dto.ts

import { OmitType } from '@nestjs/swagger';
import { BaseUserDto } from '../../../common/dto';

export class LoginDto extends OmitType(BaseUserDto, ['role'] as const) {
  password!: string;
}
