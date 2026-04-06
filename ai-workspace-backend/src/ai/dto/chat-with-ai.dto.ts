import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ChatWithAiDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsOptional()
  @IsUUID()
  documentId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectedText?: string;
}
