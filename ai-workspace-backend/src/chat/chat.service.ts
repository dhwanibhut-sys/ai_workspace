import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    return this.prisma.chat.create({
      data: {
        userId: createChatDto.userId,
        title: createChatDto.title,
      },
    });
  }

  async listChats(userId: string) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  async getChatById(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found.');
    }

    return chat;
  }

  async sendMessage(chatId: string, sendMessageDto: SendMessageDto) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found.');
    }

    const userMessage = await this.prisma.message.create({
      data: {
        chatId,
        role: 'user',
        content: sendMessageDto.content,
        documentId: sendMessageDto.documentId,
      },
    });

    const aiResponse = await this.aiService.chat({
      prompt: sendMessageDto.content,
      documentId: sendMessageDto.documentId,
      selectedText: sendMessageDto.selectedText,
    });

    const assistantMessage = await this.prisma.message.create({
      data: {
        chatId,
        role: 'assistant',
        content: aiResponse.answer,
        documentId: aiResponse.documentId ?? undefined,
      },
    });

    await this.prisma.chat.update({
      where: { id: chatId },
      data: {
        title: chat.title ?? sendMessageDto.content.slice(0, 60),
      },
    });

    return {
      chatId,
      userMessage,
      assistantMessage,
      model: aiResponse.model,
    };
  }
}
