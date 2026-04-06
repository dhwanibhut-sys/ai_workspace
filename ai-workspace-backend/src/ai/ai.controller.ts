import { Body, Controller, Post } from '@nestjs/common';
import { ChatWithAiDto } from './dto/chat-with-ai.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  chat(@Body() chatWithAiDto: ChatWithAiDto) {
    return this.aiService.chat(chatWithAiDto);
  }
}
