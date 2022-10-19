import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { ReviewEntity } from '../entities/review.entity';

@InputType()
export class CreateReviewInput extends PickType(
  ReviewEntity,
  ['text', 'roomId'],
  InputType,
) {}

@ObjectType()
export class CreateReviewOutput extends CoreOutput {
  @Field(() => ReviewEntity, { nullable: true })
  review?: ReviewEntity | null;
}
