import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(
    @Body() body: { title: string; content: string; userId: string },
  ) {
    return this.documentsService.createDocument(
      body.title,
      body.content,
      body.userId,
    );
  }

  @Get()
  get(@Query('userId') userId: string) {
    return this.documentsService.getUserDocuments(userId);
  }
}
