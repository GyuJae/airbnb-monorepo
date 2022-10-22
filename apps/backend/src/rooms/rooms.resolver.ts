import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from '../auth/auth.decorator';
import { PUB_SUB } from '../core/core.constants';
import { UserEntity } from '../users/entities/user.entity';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';
import { RoomEntity } from './entites/room.entity';
import { RoomsService } from './rooms.service';

@Resolver(() => RoomEntity)
export class RoomsResolver {
  constructor(
    private readonly roomsService: RoomsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => CreateRoomOutput)
  async createRoom(
    @Args('input') createRoomInput: CreateRoomInput,
    @CurrentUser() user: UserEntity,
  ): Promise<CreateRoomOutput> {
    const result = await this.roomsService.createRoom(createRoomInput, user);
    if (result.ok && result.room) {
      this.pubSub.publish('createRoom', {
        createRoom: result.room,
      });
    }
    return result;
  }

  @Subscription(() => RoomEntity, {
    name: 'createRoom',
  })
  onCreateRoom() {
    return this.pubSub.asyncIterator('createRoom');
  }
}
