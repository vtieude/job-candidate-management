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
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { Public, Roles } from '../../common/decorators';
import { ApiPaginatedResponse } from '../../common/swaggers/paginated.decorators';
import { UserRole } from '../../common/enums';
import { UserPayloadRequest } from '../../common/dto';
import { Ctx } from '../../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.Admin)
  @Post('bulk')
  @ApiCreatedResponse({
    description: 'All records has been successfully created.',
    type: [CreateUserDto],
  })
  @ApiBody({ type: [CreateUserDto] })
  createBulk(@Body() createUsersDto: CreateUserDto[]): CreateUserDto[] {
    return createUsersDto;
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }


  @Get()
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get('/me')
  public async getProfile(@Ctx() user: UserPayloadRequest) {
    return await this.usersService.findOneByEmail(user.email);
  }
}
