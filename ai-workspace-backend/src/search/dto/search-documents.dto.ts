import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SearchDocumentsDto {
  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  q: string;

  @IsOptional()
  @IsString()
  titleOnly?: string;
}
