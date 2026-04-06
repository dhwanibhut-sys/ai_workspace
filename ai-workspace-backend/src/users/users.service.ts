import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(email: string) {
    return this.prisma.user.create({
      data: { email },
    });
  }
}
