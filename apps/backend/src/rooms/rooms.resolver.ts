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
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import { RoomEntity } from './entites/room.entity';
import { RoomsService } from './rooms.service';

@Resolver(() => RoomEntity)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => CreateRoomOutput)
  async createRoom(
    @Args('input') createRoomInput: CreateRoomInput,
    @CurrentUser() user: UserEntity,
    @Context('pubsub') pubSub: PubSub,
  ): Promise<CreateRoomOutput> {
    const result = await this.roomsService.createRoom(createRoomInput, user);
    if (result.ok && result.room) {
      pubSub.publish({
        topic: 'createRoom',
        payload: {
          createRoom: result.room,
        },
      });
    }
    return result;
  }

  @Subscription(() => RoomEntity)
  async onCreateRoom(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe('createRoom');
  }
}
