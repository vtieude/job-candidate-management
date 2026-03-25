import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dto/user.dto';

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

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().select("-password ");
    return users;
  }

  async findOne(id: string) {
    const userEntity = await this.userModel.findById(id).select('-password');
    if (!userEntity) throw new NotFoundException('User not found');
    return userEntity;
  }


   async updateProfile(userId: string, dto: UpdateUserDto) {
    // check email trùng
    if (dto.email) {
      const exist = await this.userModel.findOne({ email: dto.email });
      if (exist && exist._id.toString() !== userId) {
        throw new BadRequestException('Email already exists');
      }
    }

    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: dto },
      { new: true },
    ).select('-password');

    if (!updated) throw new NotFoundException('User not found');

    return updated;
  }


 
  async findOneByEmail(email: string) {
    const userEntity = await this.userModel.findOne({ email });
    return userEntity;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${updateUserDto.password}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
