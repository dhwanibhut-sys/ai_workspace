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
        versions: {
          create: {
            title,
            content,
          },
        },
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
      const existingDocument = await this.prisma.document.findUnique({
        where: { id },
      });

      if (!existingDocument) {
        throw new NotFoundException('Document not found.');
      }

      return await this.prisma.document.update({
        where: { id },
        data: {
          ...updateDocumentDto,
          versions: {
            create: {
              title: existingDocument.title,
              content: existingDocument.content,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025')
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

  async getDocumentVersions(id: string) {
    await this.getDocumentById(id);

    return this.prisma.documentVersion.findMany({
      where: { documentId: id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async restoreDocumentVersion(id: string, versionId: string) {
    const [document, version] = await Promise.all([
      this.prisma.document.findUnique({ where: { id } }),
      this.prisma.documentVersion.findUnique({ where: { id: versionId } }),
    ]);

    if (!document) {
      throw new NotFoundException('Document not found.');
    }

    if (!version || version.documentId !== id) {
      throw new NotFoundException('Document version not found.');
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        title: version.title,
        content: version.content,
        versions: {
          create: {
            title: document.title,
            content: document.content,
          },
        },
      },
    });
  }
}
