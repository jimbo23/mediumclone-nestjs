import { UserService } from '@app/user/user.service';
import { Controller, Post } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  async createUser(): Promise<any> {
    return this.userService.createUser();
  }
}
