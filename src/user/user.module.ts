import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';
import { Module } from '@nestjs/common';

// must always bind Controller to Module
@Module({
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
