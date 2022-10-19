import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { PaginationInput } from '../../core/dtos/pagination-input.dto';
import { ReviewEntity } from '../entities/review.entity';

@InputType()
export class ReadReviewsInput extends PaginationInput {
  @Field(() => String)
  @IsString()
  roomId: string;
}

@ObjectType()
export class ReadReviewsOutput extends CoreOutput {
  @Field(() => [ReviewEntity])
  reviews: ReviewEntity[];
}
