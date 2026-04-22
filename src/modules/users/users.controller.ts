import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { UpdateProfileUserDto, UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { Roles } from '../../common/decorators';
import { ApiPaginatedResponse } from '../../common/swaggers/paginated.decorators';
import { UserRole } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('bulk')
  @Roles(UserRole.Admin)
  @ApiCreatedResponse({
    description: 'All records has been successfully created.',
    type: [CreateUserDto],
  })
  @ApiBody({ type: [CreateUserDto] })
  createBulk(@Body() createUsersDto: CreateUserDto[]): CreateUserDto[] {
    return createUsersDto;
  }

  @Post()
  @Roles(UserRole.Admin)
  createByAdmin(@Body() createUserDto: AdminCreateUserDto) {
    return this.usersService.createByAdmin(createUserDto);
  }

  @Patch('/updateProfile')
  @Roles(UserRole.Candidate)
  public async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileUserDto,
  ) {
    return await this.usersService.updateProfile(userId, dto);
  }

  @Get('search')
  @ApiPaginatedResponse(UserDto)
  async searchAll(): Promise<PaginatedDto<UserDto>> {
    return {
      limit: 1,
      offset: 1,
      results: await this.usersService.findAll(),
      total: 1,
    };
  }

  @Get('admin/stats')
  @Roles(UserRole.Admin)
  async getAdminStats() {
    return await this.usersService.getAdminStats();
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get()
  @Roles(UserRole.Admin)
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get('/me')
  public async getProfile(@CurrentUser('email') email: string): Promise<UserDto> {
    return await this.usersService.findOneByEmail(email);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
