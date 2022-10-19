import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  take?: number | null;

  @Field(() => String, { nullable: true })
  @IsString()
  lastId?: string | null;
}
