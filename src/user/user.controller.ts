import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { UserEntity } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    // create a user in database
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
}

// based on specs, please return
// {
//   user: {
//     email,
//     token,
//     username,
//     bio,
//     image
//   }
// }
