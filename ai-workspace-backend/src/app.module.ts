import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, UsersModule, DocumentsModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
