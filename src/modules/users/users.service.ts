import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UserRole } from '../../common/enums';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(user: CreateUserDto) {
    await this.userModel.create({
      ...user,
      role: user.role,
      active: true,
    });
    return 'This action adds a new user' + user.email;
  }

  async findAll() {
    const users = (await this.userModel.find()).map((item) => { return { email: item.email} });
    return users;
  }

  async findOne(id: number) {
    const userEntity = await this.userModel.findOne({ where: { id } });
    return userEntity;
  }

  async findOneByEmail(email: string) {
    const userEntity = await this.userModel.findOne({ email: email });
    return userEntity;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${updateUserDto.password}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
