import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from '@app/profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get('/:username')
  async getProfile(@Param('username') username: string) {
    const profile = await this.profileService.getProfile(username);
    return this.profileService.buildProfileResponse(profile);
  }
}
