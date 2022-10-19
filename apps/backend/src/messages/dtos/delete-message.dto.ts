import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { MessageEntity } from '../entities/message.entity';

@InputType()
export class DeleteMessageInput {
  @Field(() => String)
  @IsString()
  messageId: string;
}

@ObjectType()
export class DeleteMessageOutput extends CoreOutput {
  @Field(() => MessageEntity, { nullable: true })
  message?: MessageEntity | null;
}
