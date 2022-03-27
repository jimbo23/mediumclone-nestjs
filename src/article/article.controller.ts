import { Controller, Post } from '@nestjs/common';

@Controller('article')
export class ArticleController {
  @Post()
  async create() {
    return 'created article';
  }
}
