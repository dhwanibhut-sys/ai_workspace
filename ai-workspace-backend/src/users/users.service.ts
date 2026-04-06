import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(email: string) {
    // Try to find the user first
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return existing;
    }

    try {
      return await this.prisma.user.create({
        data: { email },
      });
    } catch (error) {
      // Re-check for race condition just in case
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return this.prisma.user.findUnique({
          where: { email },
        });
      }

      throw error;
    }
  }
}
