import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    console.table(newUser);
    // this single line below does all the magic to save data to db
    return await this.userRepository.save(newUser);
  }
}
