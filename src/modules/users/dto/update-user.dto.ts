import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserLevel } from '../schemas/user.schema';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(9)
  @MaxLength(15)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: UserLevel, example: UserLevel.Junior, })
  @IsOptional()
  @IsEnum(UserLevel)
  level?: UserLevel;
}


export class UpdateProfileUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(9)
  @MaxLength(15)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: UserLevel, example: UserLevel.Junior, })
  @IsOptional()
  @IsEnum(UserLevel)
  level?: UserLevel;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  skills?: string[];
}
