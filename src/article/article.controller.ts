import { ArticleEntity } from '@app/article/article.entity';
import { ArticleService } from '@app/article/article.service';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { AuthGuard } from '@app/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async create(
    @User() user: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.create(user, createArticleDto);
    return this.articleService.buildArticleResponse(article);
  }

  @Get('/:slug')
  async getOneArticle(
    @Param('slug')
    slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@Param('slug') slug: string, @User('id') userId: number) {
    return await this.articleService.deleteArticle(slug, userId);
  }

  @Put('/:slug')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateArticle(
    @User('id') userId: number,
    @Body('article') createArticleDto: CreateArticleDto,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(
      userId,
      slug,
      createArticleDto,
    );

    return this.articleService.buildArticleResponse(article);
  }
}
