import { ArticleService } from '@app/article/article.service';
import { Controller, Post } from '@nestjs/common';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Post()
  async create() {
    return this.articleService.create();
  }
}
