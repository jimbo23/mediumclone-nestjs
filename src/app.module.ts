import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { AuthMiddleware } from '@app/middlewares/auth.middleware';
import { TagModule } from '@app/tag/tag.module';
import { UserModule } from '@app/user/user.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';
import ormconfig from './ormconfig';

@Module({
  // Our application is configured in a module with a typeorm
  // with the ormconfig.
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL, // ALL means doing this globally
    });
  }
}
