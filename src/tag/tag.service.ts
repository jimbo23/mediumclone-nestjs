import { Injectable } from '@nestjs/common';

// to tell nestjs that this is an injectable service
@Injectable()
export class TagService {
  findAll(): string[] {
    return ['dragons', 'coffee'];
  }
}
