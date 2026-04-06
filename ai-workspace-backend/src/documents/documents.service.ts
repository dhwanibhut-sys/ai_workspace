import { NotFoundException, ForbiddenException, Injectable } from '@nestjs/common';
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

  async getDocumentById(id: string, authorizingUserId: string) {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        ownerId: authorizingUserId,
      },
    });

    if (!document) {
      throw new ForbiddenException(
        'Document not found or you do not have permission to access it.',
      );
    }

    return document;
  }

  async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    authorizingUserId: string,
  ) {
    try {
      const existingDocument = await this.prisma.document.findFirst({
        where: {
          id,
          ownerId: authorizingUserId,
        },
      });

      if (!existingDocument) {
        throw new ForbiddenException(
          'Document not found or you do not have permission to update it.',
        );
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
        error instanceof ForbiddenException ||
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025')
      ) {
        throw error;
      }

      throw error;
    }
  }

  async deleteDocument(id: string, authorizingUserId: string) {
    try {
      const existingDocument = await this.prisma.document.findFirst({
        where: {
          id,
          ownerId: authorizingUserId,
        },
      });

      if (!existingDocument) {
        throw new ForbiddenException(
          'Document not found or you do not have permission to delete it.',
        );
      }

      await this.prisma.document.delete({
        where: { id },
      });

      return { message: 'Document deleted successfully.' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025')
      ) {
        throw error;
      }

      throw error;
    }
  }

  async getDocumentVersions(id: string, authorizingUserId: string) {
    await this.getDocumentById(id, authorizingUserId);

    return this.prisma.documentVersion.findMany({
      where: { documentId: id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async restoreDocumentVersion(
    id: string,
    versionId: string,
    authorizingUserId: string,
  ) {
    const [document, version] = await Promise.all([
      this.prisma.document.findFirst({
        where: {
          id,
          ownerId: authorizingUserId,
        },
      }),
      this.prisma.documentVersion.findUnique({ where: { id: versionId } }),
    ]);

    if (!document) {
      throw new ForbiddenException(
        'Document not found or you do not have permission to restore versions of it.',
      );
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
