import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { PaginationInput } from '../../core/dtos/pagination-input.dto';
import { MessageEntity } from '../entities/message.entity';

@InputType()
export class ReadMessagesInput extends PaginationInput {
  @Field(() => String)
  @IsString()
  chattingRoomId: string;
}

@ObjectType()
export class ReadMessagesOutput extends CoreOutput {
  @Field(() => [MessageEntity])
  messages: MessageEntity[];
}
