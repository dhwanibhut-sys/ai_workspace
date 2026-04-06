import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { RestoreDocumentVersionDto } from './dto/restore-document-version.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() body: CreateDocumentDto) {
    return this.documentsService.createDocument(
      body.title,
      body.content,
      body.userId,
    );
  }

  @Get()
  get(@Query('userId', ParseUUIDPipe) userId: string) {
    return this.documentsService.getUserDocuments(userId);
  }

  @Get(':id')
  getById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.documentsService.getDocumentById(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId', ParseUUIDPipe) userId: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.updateDocument(id, updateDocumentDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.documentsService.deleteDocument(id, userId);
  }

  @Get(':id/versions')
  getVersions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.documentsService.getDocumentVersions(id, userId);
  }

  @Post(':id/versions/restore')
  restoreVersion(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId', ParseUUIDPipe) userId: string,
    @Body() restoreDocumentVersionDto: RestoreDocumentVersionDto,
  ) {
    return this.documentsService.restoreDocumentVersion(
      id,
      restoreDocumentVersionDto.versionId,
      userId,
    );
  }
}
