import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { ReviewEntity } from '../entities/review.entity';

@InputType()
export class DeleteReviewInput extends PickType(
  ReviewEntity,
  ['id'],
  InputType,
) {}

@ObjectType()
export class DeleteReviewOutput extends CoreOutput {
  @Field(() => ReviewEntity, { nullable: true })
  review?: ReviewEntity | null;
}
