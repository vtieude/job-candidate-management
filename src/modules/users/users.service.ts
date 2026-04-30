import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dto/user.dto';
import { hash } from 'bcrypt';
import { JobsService } from '../jobs/jobs.service';
import { JobCandidateService } from '../job-candidate/job-candidate.service';
import { UserRole } from '../../common/enums';
import { IFindAICandidate } from '../../interfaces/job.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jobsService: JobsService,
    private readonly jobCandidateService: JobCandidateService,
  ) { }

  private toDto(user: User): UserDto {
    return {
      _id: user._id,
      password: user.password,
      email: user.email,
      role: user.role,
      active: user.active,
      skills: user.skills,
      phone: user.phone,
      level: user.level,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async findAllWithAI(aiFilter: IFindAICandidate) {
    const filter: any = {};
    if (aiFilter.level) {
      filter.level = { $regex: aiFilter.level, $options: 'i' };
    }
    if (aiFilter.skills && aiFilter.skills.length > 0) {
      // Use $and to ensure the document contains EVERY skill in the list
      filter.$and = aiFilter.skills.map(skill => ({
        skills: { 
          $regex: skill, 
          $options: 'i' 
        }
      }));
    }
    
    const skip = (Math.min(aiFilter.page, 1) - 1) * aiFilter.limit;
        
    const users = await this.userModel.find(filter).limit(aiFilter.limit ?? 10).skip(skip).sort({ createdAt: -1 }).exec();
    return users.map((user) => this.toDto(user));
  }

  async create(user: CreateUserDto) {
    await this.userModel.create({
      ...user,
      role: user.role,
      active: true,
    });
    return 'This action adds a new user' + user.email;
  }

  async createByAdmin(user: CreateUserDto & { role: UserRole }) {
    const existingUser = await this.userModel.findOne({ email: user.email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await hash(user.password, 10);
    const created = await this.userModel.create({
      ...user,
      password: passwordHash,
      active: true,
    });

    return created.toObject();
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().select('-password ');
    return users;
  }

  async findOne(id: string) {
    const userEntity = await this.userModel.findById(id).select('-password');
    if (!userEntity) throw new NotFoundException('User not found');
    return userEntity;
  }

  async findPublicOne(id: string) {
    const userEntity = await this.userModel.findById(id).select('-password');
    if (!userEntity) throw new NotFoundException('User not found');
    return this.toDto(userEntity);
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const updateData: any = {};
    if (dto.fullName !== undefined) updateData.fullName = dto.fullName;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.level !== undefined) updateData.level = dto.level;

    if (dto.email?.trim) {
      const exist = await this.userModel.findOne({ email: dto.email });
      if (exist && exist._id.toString() !== userId) {
        throw new BadRequestException('Email already exists');
      }
      updateData.email = dto.email;
    }

    if ((dto as any).skills !== undefined) {
      updateData.skills = (dto as any).skills;
    }

    const updated = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    if (!updated) throw new NotFoundException('User not found');

    return updated;
  }

  async findOneByEmail(email: string) {
    const userEntity = await this.userModel.findOne({ email });
    if (!userEntity) {
       throw new NotFoundException('User not founds');
    }
    return this.toDto(userEntity);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const payload: any = { ...updateUserDto };

    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email });
      if (existingUser && existingUser._id.toString() !== id) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      payload.password = await hash(updateUserDto.password, 10);
    }

    const updated = await this.userModel.findByIdAndUpdate(id, payload, { new: true }).select('-password');
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id).select('-password');
    if (!deleted) throw new NotFoundException('User not found');
    return deleted;
  }

  async getAdminStats() {
    const [totalUsers, candidateCount, recruiterCount, adminCount, totalJobs, applications] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ role: UserRole.Candidate }),
      this.userModel.countDocuments({ role: UserRole.Recruiter }),
      this.userModel.countDocuments({ role: UserRole.Admin }),
      this.jobsService.countAll(),
      this.jobCandidateService.findAll(),
    ]);

    return {
      users: {
        total: totalUsers,
        candidates: candidateCount,
        recruiters: recruiterCount,
        admins: adminCount,
      },
      jobs: {
        total: totalJobs,
      },
      applications: {
        total: applications.length,
      },
    };
  }
}
