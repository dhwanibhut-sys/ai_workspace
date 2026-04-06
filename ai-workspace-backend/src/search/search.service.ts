import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchDocumentsDto } from './dto/search-documents.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  searchDocuments(searchDocumentsDto: SearchDocumentsDto) {
    const { userId, q, titleOnly } = searchDocumentsDto;

    return this.prisma.document.findMany({
      where: {
        ownerId: userId,
        ...(titleOnly === 'true'
          ? {
              title: {
                contains: q,
                mode: 'insensitive',
              },
            }
          : {
              OR: [
                {
                  title: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  content: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ],
            }),
      },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });
  }
}
