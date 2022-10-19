import {
  Args,
  Context,
  Mutation,
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
import { ChattingRoomEntity } from './entities/chattingRoom.entity';
import { MessageEntity } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver(() => MessageEntity)
export class MessagesResolver {}

@Resolver(() => ChattingRoomEntity)
export class ChattingRoomsResolver {
  constructor(private readonly messagesService: MessagesService) {}

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
