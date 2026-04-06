import { NotFoundException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDocument(title: string, content: string, userId: string) {
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

  async getDocumentById(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto) {
    try {
      return await this.prisma.document.update({
        where: { id },
        data: updateDocumentDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Document not found.');
      }

      throw error;
    }
  }

  async deleteDocument(id: string) {
    try {
      await this.prisma.document.delete({
        where: { id },
      });

      return { message: 'Document deleted successfully.' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Document not found.');
      }

      throw error;
    }
  }
}
