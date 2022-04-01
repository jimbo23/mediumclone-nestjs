import { ArticleEntity } from '@app/article/article.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import slugify from 'slugify';
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getArticles(
    userId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    const articlesCount = await queryBuilder.getCount();

    if (query.favourited) {
      const user = await this.userRepository.findOne(
        {
          username: query.favourited,
        },
        { relations: ['favourites'] },
      );

      const ids = user.favourites.map((el) => el.id);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        // this will give []
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        username: query.author,
      });
      // authorId is a foreign key to articles :)
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    const articles = await queryBuilder.getMany();

    let favouriteIds: number[] = [];
    if (userId) {
      const user = await this.userRepository.findOne(userId, {
        relations: ['favourites'],
      });
      favouriteIds = user.favourites.map((fav) => fav.id);
    }

    const articlesWithFavourited = articles.map((article) => {
      const favourited = favouriteIds.includes(article.id);
      return { ...article, favourited };
    });

    return { articles: articlesWithFavourited, articlesCount };
  }

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

  async addArticleToFavourites(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['favourites'],
    });

    const article = await this.findBySlug(slug);

    const isNotFavourited =
      user.favourites.findIndex((ar) => ar.id === article.id) === -1;

    if (isNotFavourited) {
      user.favourites.push(article);
      article.favouritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async deleteArticleFromFavourites(userId: number, slug: string) {
    const user = await this.userRepository.findOne(userId, {
      relations: ['favourites'],
    });
    const article = await this.findBySlug(slug);

    const articleIndex = user.favourites.findIndex(
      (ar) => ar.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favourites.splice(articleIndex, 1);
      article.favouritesCount--;
      await this.articleRepository.save(article);
      await this.userRepository.save(user);
    }

    return article;
  }

  async getFeed(
    userId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({ followerId: userId });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUserIds = follows.map((follow) => follow.followingId);

    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('articles.createAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }
}
