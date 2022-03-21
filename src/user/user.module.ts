import { UserController } from '@app/user/user.controller';
import { UserEntity } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// must always bind Controller to Module
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  // after doing the above then you can inject Repositiory with User Entity
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
