import { Field, ObjectType } from '@nestjs/graphql';
import { Review } from '@prisma/client';
import { IsString, MaxLength } from 'class-validator';
import { CoreEntity } from '../../core/entites/core.entity';

@ObjectType()
export class ReviewEntity extends CoreEntity implements Review {
  @Field(() => String)
  @IsString()
  @MaxLength(450)
  text: string;

  @Field(() => String)
  @IsString()
  userId: string;

  @Field(() => String)
  @IsString()
  roomId: string;
}
