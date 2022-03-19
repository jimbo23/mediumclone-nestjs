import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagEntity } from './tag.entity';

// controller doesn't know any business logic.
// the business logic is isolated inside service.

@Controller('tags')
export class TagController {
  // local property, read only, private ==> not available to outside
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<TagEntity[]> {
    return await this.tagService.findAll();
  }
}
