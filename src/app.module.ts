import { Module } from '@nestjs/common';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { AppController } from '@app/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';

@Module({
  // Our application is configured in a module with a typeorm
  // with the ormconfig.
  imports: [TypeOrmModule.forRoot(ormconfig), TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
