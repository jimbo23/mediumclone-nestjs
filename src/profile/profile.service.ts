import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProfileType } from '@app/profile/types/profile.type';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async getProfile(userId: number, username: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });
    if (!profile) {
      throw new HttpException('Profile not found!', HttpStatus.NOT_FOUND);
    }
    return { ...profile, following: false };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    // when you work on /follow POST and /unfollow POST
    // you are going to return the profile response as well
    // thats why it makes sense to filter out some props here
    delete profile.email;
    delete profile.id;
    return { profile };
  }
}
