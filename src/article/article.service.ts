import { ArticleEntity } from '@app/article/article.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { ArticleController } from '@app/article/article.controller';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async create(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    }

    article.author = currentUser;

    article.slug = this.getSlug(createArticleDto.title);

    return await this.articleRepository.save(article);
  }

  async getArticle(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ slug });
    if (!article) {
      throw new HttpException('Article Not Found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  private getSlug(title: string): string {
    const uniqueString = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    return slugify(title, { lower: true }) + '-' + uniqueString;
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  async delete(article: ArticleEntity) {}
}
