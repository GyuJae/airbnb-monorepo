import { Field, ObjectType } from '@nestjs/graphql';
import { ChattingRoom } from '@prisma/client';
import { IsString } from 'class-validator';
import { CoreEntity } from '../../core/entites/core.entity';

@ObjectType()
export class ChattingRoomEntity extends CoreEntity implements ChattingRoom {
  @Field(() => [String])
  userIDs: string[];

  @Field(() => String)
  @IsString()
  roomId: string;
}
