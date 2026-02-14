import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { UserPayloadRequest } from '../../common/dto';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    // Logic check pwd here
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // Logic generate token here
    const payload: UserPayloadRequest = {
      email: user.email,
      userId: user.id.toString(),
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const passwordHash = await hash(createUserDto.password, 10);
    await this.usersService.create({
      email: createUserDto.email,
      password: passwordHash,
    });
    return 'This action adds a new user' + createUserDto.email;
  }
}
