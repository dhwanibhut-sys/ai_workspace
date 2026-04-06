import { IsUUID } from 'class-validator';

export class RestoreDocumentVersionDto {
  @IsUUID()
  versionId: string;
}
