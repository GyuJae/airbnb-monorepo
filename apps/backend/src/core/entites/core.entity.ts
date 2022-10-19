import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';

@ObjectType()
export class CoreEntity {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => Date)
  @IsDate()
  createdAt: Date;

  @Field(() => Date)
  @IsDate()
  updatedAt: Date;
}
