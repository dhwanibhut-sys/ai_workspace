import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DocumentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly documentsService: DocumentsService) {}

  private logger: Logger = new Logger('DocumentsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_document')
  async handleJoinDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { documentId: string; userId: string },
  ) {
    try {
      // Verify ownership before joining the room
      await this.documentsService.getDocumentById(data.documentId, data.userId);
      client.join(data.documentId);
      this.logger.log(`Client ${client.id} (User ${data.userId}) joined document: ${data.documentId}`);
    } catch (error) {
      this.logger.warn(`Unauthorized join attempt by ${client.id} for document ${data.documentId}`);
      client.emit('error', { message: 'Unauthorized access to document.' });
    }
  }

  @SubscribeMessage('leave_document')
  handleLeaveDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() documentId: string,
  ) {
    client.leave(documentId);
    this.logger.log(`Client ${client.id} left document: ${documentId}`);
  }

  @SubscribeMessage('doc_update')
  handleDocUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { documentId: string; content: string; title: string },
  ) {
    // Broadcast the update to everyone else in the same document room
    client.to(data.documentId).emit('doc_updated', {
      content: data.content,
      title: data.title,
    });
    this.logger.log(`Document ${data.documentId} updated by ${client.id}`);
  }
}
