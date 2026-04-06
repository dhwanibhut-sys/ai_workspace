import { Controller, Get, Query } from '@nestjs/common';
import { SearchDocumentsDto } from './dto/search-documents.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('documents')
  searchDocuments(@Query() searchDocumentsDto: SearchDocumentsDto) {
    return this.searchService.searchDocuments(searchDocumentsDto);
  }
}
