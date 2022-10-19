import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { ChattingRoomEntity } from '../entities/chattingRoom.entity';

@InputType()
export class CreateChattingRoomInput extends PickType(
  ChattingRoomEntity,
  ['roomId'],
  InputType,
) {}

@ObjectType()
export class CreateChattingRoomOutput extends CoreOutput {
  @Field(() => ChattingRoomEntity, { nullable: true })
  chattingRoom?: ChattingRoomEntity | null;
}
