import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { IChatService } from './interfaces/chat.service.interface';
import { IChatRepository } from './interfaces/chat.repository.interface';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ChatController],
  providers: [
    {
      provide: IChatService,
      useClass: ChatService,
    },
    {
      provide: IChatRepository,
      useClass: ChatRepository,
    },
  ],
  exports: [IChatService],
})
export class ChatModule {}
