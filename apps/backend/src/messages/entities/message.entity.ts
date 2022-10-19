import { Field, ObjectType } from '@nestjs/graphql';
import { Message } from '@prisma/client';
import { IsString } from 'class-validator';
import { CoreEntity } from '../../core/entites/core.entity';

@ObjectType()
export class MessageEntity extends CoreEntity implements Message {
  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => String)
  @IsString()
  userId: string;

  @Field(() => String)
  @IsString()
  chattingRoomId: string;
}
