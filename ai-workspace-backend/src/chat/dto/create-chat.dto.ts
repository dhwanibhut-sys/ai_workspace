import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  title?: string;
}
