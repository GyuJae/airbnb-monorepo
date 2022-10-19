import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ChattingRoomsResolver, MessagesResolver } from './messages.resolver';

@Module({
  providers: [MessagesService, MessagesResolver, ChattingRoomsResolver],
})
export class MessagesModule {}
