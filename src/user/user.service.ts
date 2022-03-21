import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async createUser(createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
