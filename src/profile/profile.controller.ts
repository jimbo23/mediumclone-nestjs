import { Controller, Get, Param } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @Get('/:username')
  async getProfile(@Param('username') username: string) {
    return username;
  }
}
