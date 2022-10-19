import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { RoomEntity } from '../entites/room.entity';

@InputType()
export class CreateRoomInput extends PickType(
  RoomEntity,
  [
    'name',
    'country',
    'city',
    'price',
    'rooms',
    'toilets',
    'description',
    'address',
    'petFriendly',
    'kind',
    'amenityIDs',
    'categoryId',
  ],
  InputType,
) {}

@ObjectType()
export class CreateRoomOutput extends CoreOutput {
  @Field(() => RoomEntity, { nullable: true })
  room?: RoomEntity | null;
}
