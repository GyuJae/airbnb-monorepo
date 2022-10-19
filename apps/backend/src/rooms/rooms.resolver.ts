import { Resolver } from '@nestjs/graphql';
import { RoomEntity } from './entites/room.entity';

@Resolver(() => RoomEntity)
export class RoomsResolver {}
