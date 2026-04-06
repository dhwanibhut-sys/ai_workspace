import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { ChatWithAiDto } from './dto/chat-with-ai.dto';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async chat(chatWithAiDto: ChatWithAiDto) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new InternalServerErrorException(
        'OPENAI_API_KEY is missing from the environment.',
      );
    }

    const openai = new OpenAI({ apiKey });
    const document = chatWithAiDto.documentId
      ? await this.prisma.document.findUnique({
          where: { id: chatWithAiDto.documentId },
        })
      : null;

    if (chatWithAiDto.documentId && !document) {
      throw new NotFoundException('Document not found.');
    }

    const contextSections = [
      'You are the AI assistant for an AI workspace product.',
      'Answer clearly and concisely.',
      'If document context is provided, prioritize it over general knowledge.',
      'If the answer is not supported by the provided context, say so explicitly.',
    ];

    if (document) {
      contextSections.push(
        `Current document title: ${document.title}`,
        `Current document content:\n${document.content}`,
      );
    }

    if (chatWithAiDto.selectedText) {
      contextSections.push(
        `User selected this text:\n${chatWithAiDto.selectedText}`,
      );
    }

    try {
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
        instructions: contextSections.join('\n\n'),
        input: chatWithAiDto.prompt,
        max_output_tokens: 500,
        store: false,
      });

      const answer = response.output_text?.trim();

      if (!answer) {
        throw new BadRequestException(
          'The AI response was empty. Please try again.',
        );
      }

      return {
        answer,
        model: response.model,
        documentId: document?.id ?? null,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'OpenAI request failed. Check your API key, model, and network access.',
      );
    }
  }
}
