import { JWT_TOKEN } from '@app/config';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';

// make services injectable and make available to
// other classes by dependency injection
// doing constructor(private readonly userService: UserService) {}
// remember to update the providers: [] in Module
@Injectable()
export class UserService {
  constructor(
    // interact with database
    // when you do the below, make sure you import TypeOrm in Module
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    // this single line below does all the magic to save data to db
    return await this.userRepository.save(newUser);
  }

  buildUserResponse(user: UserEntity): any {
    return {
      user: {
        ...user,
        token: this.generateToken(user),
      },
    };
  }

  generateToken(user: UserEntity): string {
    return sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_TOKEN,
    );
  }
}
