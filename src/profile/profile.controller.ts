import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from '@app/profile/profile.service';
import { User } from '@app/user/decorators/user.decorator';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get('/:username')
  async getProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(userId, username);
    return this.profileService.buildProfileResponse(profile);
  }
}
