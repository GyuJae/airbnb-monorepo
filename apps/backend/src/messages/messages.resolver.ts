import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from '../auth/auth.decorator';
import { PUB_SUB } from '../core/core.constants';
import { UserEntity } from '../users/entities/user.entity';
import {
  CreateChattingRoomInput,
  CreateChattingRoomOutput,
} from './dtos/create-chatting-room.dto';
import {
  CreateMessageInput,
  CreateMessageOutput,
} from './dtos/create-message.dto';
import {
  DeleteMessageInput,
  DeleteMessageOutput,
} from './dtos/delete-message.dto';
import {
  ReadMessagesInput,
  ReadMessagesOutput,
} from './dtos/read-messages.dto';
import { ChattingRoomEntity } from './entities/chattingRoom.entity';
import { MessageEntity } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver(() => MessageEntity)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @ResolveField(() => UserEntity)
  async user(@Parent() message: MessageEntity): Promise<UserEntity> {
    return this.messagesService.user(message);
  }

  @Query(() => ReadMessagesOutput)
  async readMessages(
    @Args('input') readMessagesInput: ReadMessagesInput,
  ): Promise<ReadMessagesOutput> {
    return this.messagesService.readMessages(readMessagesInput);
  }

  @Mutation(() => CreateMessageOutput)
  async createMessage(
    @Args('input') createMessageInput: CreateMessageInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CreateMessageOutput> {
    const result = await this.messagesService.createMessage(
      createMessageInput,
      currentUser,
    );
    if (result.ok && result.message) {
      this.pubSub.publish('createMessage', {
        createMessage: result.message,
      });
    }
    return result;
  }

  @Subscription(() => MessageEntity, {
    name: 'createMessage',
    filter: (payload, valiables) => {
      return payload.createMessage.chattingRoomId === valiables.chattingRoomId;
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCreateMessage(@Args('chattingRoomId') _chattingRoomId: string) {
    return this.pubSub.asyncIterator('createMessage');
  }

  @Mutation(() => DeleteMessageOutput)
  async deleteMessage(
    @Args('input') deleteMessageInput: DeleteMessageInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<DeleteMessageOutput> {
    const result = await this.messagesService.deleteMessage(
      deleteMessageInput,
      currentUser,
    );
    if (result.ok && result.message) {
      this.pubSub.publish('deleteMessage', {
        deleteMessage: result.message,
      });
    }
    return result;
  }

  @Subscription(() => MessageEntity, {
    name: 'deleteMessage',
    filter: (payload, valiables) => {
      return payload.deleteMessage.chattingRoomId === valiables.chattingRoomId;
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDeleteMessage(@Args('chattingRoomId') _chattingRoomId: string) {
    return this.pubSub.asyncIterator('deleteMessage');
  }
}

@Resolver(() => ChattingRoomEntity)
export class ChattingRoomsResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @ResolveField(() => [UserEntity])
  async users(
    @Parent() chattingRoom: ChattingRoomEntity,
  ): Promise<UserEntity[]> {
    return this.messagesService.users(chattingRoom);
  }

  @Mutation(() => CreateChattingRoomOutput)
  async createChattingRoom(
    @Args('input') createChattingRoomInput: CreateChattingRoomInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CreateChattingRoomOutput> {
    const result = await this.messagesService.createChattingRoom(
      createChattingRoomInput,
      currentUser,
    );
    if (result.ok && result.chattingRoom) {
      this.pubSub.publish('createChattingRoom', {
        createChattingRoom: result.chattingRoom,
      });
    }
    return result;
  }

  @Subscription(() => ChattingRoomEntity, {
    name: 'createChattingRoom',
  })
  onCreateChattingRoom() {
    return this.pubSub.asyncIterator('createChattingRoom');
  }
}
