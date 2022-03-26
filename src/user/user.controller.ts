import { AuthGuard } from '@app/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { LoginUserDto } from '@app/user/dto/login-user.dto';
import { UpdateUserDto } from '@app/user/dto/update-user.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { UserEntity } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  @UsePipes(new ValidationPipe()) // will need class-transformer && class-validator package
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    // create a user in database
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('/users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('/user')
  @UseGuards(AuthGuard)
  async updateUser(
    @Body('user') updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ): Promise<any> {
    const updatedUser = await this.userService.updateUser(updateUserDto, user);
    return this.userService.buildUserResponse(updatedUser);
  }
}
