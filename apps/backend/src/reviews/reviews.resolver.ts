import {
  Args,
  Context,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'mercurius';
import { CurrentUser } from '../auth/auth.decorator';
import { UserEntity } from '../users/entities/user.entity';
import {
  CreateReviewInput,
  CreateReviewOutput,
} from './dtos/create-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver(() => ReviewEntity)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => CreateReviewOutput)
  async createReview(
    @Args('input') createReviewInput: CreateReviewInput,
    @CurrentUser() user: UserEntity,
    @Context('pubsub') pubSub: PubSub,
  ): Promise<CreateReviewOutput> {
    const result = await this.reviewsService.createReview(
      createReviewInput,
      user,
    );
    if (result.ok && result.review) {
      pubSub.publish({
        topic: 'createReview',
        payload: {
          createReview: result.review,
        },
      });
    }
    return result;
  }

  @Subscription(() => ReviewEntity, {
    name: 'createReview',
  })
  async onCreateReview(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe('createReview');
  }
}
