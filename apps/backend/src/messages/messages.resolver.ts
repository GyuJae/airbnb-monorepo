import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'mercurius';
import { CurrentUser } from '../auth/auth.decorator';
import { UserEntity } from '../users/entities/user.entity';
import {
  CreateChattingRoomInput,
  CreateChattingRoomOutput,
} from './dtos/create-chatting-room.dto';
import {
  CreateMessageInput,
  CreateMessageOutput,
} from './dtos/create-message.dto';
import { ChattingRoomEntity } from './entities/chattingRoom.entity';
import { MessageEntity } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver(() => MessageEntity)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => CreateMessageOutput)
  async createMessage(
    @Args('input') createMessageInput: CreateMessageInput,
    @CurrentUser() currentUser: UserEntity,
    @Context('pubsub') pubSub: PubSub,
  ): Promise<CreateMessageOutput> {
    const result = await this.messagesService.createMessage(
      createMessageInput,
      currentUser,
    );
    if (result.ok && result.message) {
      pubSub.publish({
        topic: 'createMessage',
        payload: {
          createMessage: result.message,
        },
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
  onCreateMessage(
    @Args('chattingRoomId') _chattingRoomId: string,
    @Context('pubsub') pubSub: PubSub,
  ) {
    return pubSub.subscribe('createMessage');
  }
}

@Resolver(() => ChattingRoomEntity)
export class ChattingRoomsResolver {
  constructor(private readonly messagesService: MessagesService) {}

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
    @Context('pubsub') pubSub: PubSub,
  ): Promise<CreateChattingRoomOutput> {
    const result = await this.messagesService.createChattingRoom(
      createChattingRoomInput,
      currentUser,
    );
    if (result.ok && result.chattingRoom) {
      pubSub.publish({
        topic: 'createChattingRoom',
        payload: {
          createChattingRoom: result.chattingRoom,
        },
      });
    }
    return result;
  }

  @Subscription(() => ChattingRoomEntity, {
    name: 'createChattingRoom',
  })
  onCreateChattingRoom(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe('createChattingRoom');
  }
}
