import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

// controller doesn't know any business logic.
// the business logic is isolated inside service.

@Controller('tags')
export class TagController {
  // local property, read only, private ==> not available to outside
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    // reshape the data to desired shape :))
    const tags = await this.tagService.findAll();
    return { tags: tags.map((tag) => tag.name) };
  }
}
