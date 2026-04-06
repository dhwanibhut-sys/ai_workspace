import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  createDocument(title: string, content: string, userId: string) {
    return this.prisma.document.create({
      data: {
        title,
        content,
        ownerId: userId,
      },
    });
  }

  getUserDocuments(userId: string) {
    return this.prisma.document.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
