import { InputType, PickType } from '@nestjs/graphql';
import { RoomEntity } from '../entites/room.entity';

@InputType()
export class CreateRoomInput extends PickType(RoomEntity, [], InputType) {}
