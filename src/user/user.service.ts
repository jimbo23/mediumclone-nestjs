import { JWT_SECRET } from '@app/config';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { LoginUserDto } from '@app/user/dto/login-user.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { UserEntity } from '@app/user/user.entity';
import {
  HttpCode,
  HttpException,
  HttpModule,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';

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
    // from payload:
    const { username, email } = createUserDto;

    const userByUsername = await this.userRepository.findOne({ username });
    const userByEmail = await this.userRepository.findOne({ email });

    if (userByUsername || userByEmail) {
      throw new HttpException(
        'username or email is existing!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    // this single line below does all the magic to save data to db
    return await this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id); // shorthand for typeorm
    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne(
      { email },
      { select: ['id', 'bio', 'email', 'image', 'password', 'username'] },
    );

    if (!user) {
      throw new HttpException(
        'Credentials are not valid!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;

    return user;
  }

  async updateUser(updateUserDto, user): Promise<UserEntity> {
    return this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  // we only create DTO for payload.
  generateToken(user: UserEntity): string {
    return sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
    );
  }

  // good practice: create interface for response
  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateToken(user),
      },
    };
  }
}
