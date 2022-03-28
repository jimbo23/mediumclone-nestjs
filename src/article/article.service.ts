import { ArticleEntity } from '@app/article/article.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import slugify from 'slugify';

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

  async findBySlug(slug: string): Promise<ArticleEntity> {
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

  async deleteArticle(slug: string, userId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (article.author.id !== userId) {
      throw new HttpException('You are not an author!', HttpStatus.FORBIDDEN); //403
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    userId: number,
    slug: string,
    updateArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (article.author.id !== userId) {
      throw new HttpException(
        'You are not the author',
        HttpStatus.UNAUTHORIZED,
      );
    }

    Object.assign(article, updateArticleDto);

    article.slug = this.getSlug(article.title);

    return await this.articleRepository.save(article);
  }
}
