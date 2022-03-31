import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProfileType } from '@app/profile/types/profile.type';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
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

  async followProfile(userId: number, username: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ username });

    if (!username) {
      throw new HttpException('Profile Not Found!', HttpStatus.NOT_FOUND);
    }

    if (profile.id === userId) {
      throw new HttpException(
        "You can't follow yourself",
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      followerId: userId,
      followingId: profile.id,
    });

    if (!follow) {
      const createFollow = new FollowEntity();
      createFollow.followerId = userId;
      createFollow.followingId = profile.id;
      await this.followRepository.save(createFollow);
    }

    return { ...profile, following: true };
  }
}
