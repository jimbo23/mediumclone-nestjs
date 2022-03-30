import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async getProfile(userId: number, username: string) {
    const profile = await this.userRepository.findOne({ username });
    if (!profile) {
      throw new HttpException('Profile not found!', HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  buildProfileResponse(profile) {
    let { username, bio, image } = profile;
    return {
      profile: {
        username,
        bio,
        image,
      },
    };
  }
}
