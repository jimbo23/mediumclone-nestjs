// only require this when it's run in JS.
// TS will be transpiled to JS during runtime

if (!process.env._IS_TS_NODE) {
  require('module-alias/register');
}

import { AppModule } from '@app/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
