import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { MessageEntity } from '../entities/message.entity';

@InputType()
export class CreateMessageInput extends PickType(
  MessageEntity,
  ['text', 'chattingRoomId'],
  InputType,
) {}

@ObjectType()
export class CreateMessageOutput extends CoreOutput {
  @Field(() => MessageEntity, { nullable: true })
  message?: MessageEntity | null;
}
