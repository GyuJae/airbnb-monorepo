import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
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
import {
  DeleteReviewInput,
  DeleteReviewOutput,
} from './dtos/delete-review.dto';
import { ReadReviewsInput, ReadReviewsOutput } from './dtos/read-reviews.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver(() => ReviewEntity)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ResolveField(() => UserEntity)
  async user(@Parent() review: ReviewEntity): Promise<UserEntity> {
    return this.reviewsService.user(review);
  }

  @Query(() => ReadReviewsOutput)
  async readReviews(
    @Args('input') readReviewsInput: ReadReviewsInput,
  ): Promise<ReadReviewsOutput> {
    return this.reviewsService.readReviews(readReviewsInput);
  }

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

  @Mutation(() => DeleteReviewOutput)
  async deleteReview(
    @Args('input') deleteReviewInput: DeleteReviewInput,
    @CurrentUser() user: UserEntity,
    @Context('pubsub') pubSub: PubSub,
  ): Promise<DeleteReviewOutput> {
    const result = await this.reviewsService.deleteReview(
      deleteReviewInput,
      user,
    );
    if (result.ok && result.review) {
      pubSub.publish({
        topic: 'deleteReview',
        payload: {
          deleteReview: result.review,
        },
      });
    }
    return result;
  }

  @Subscription(() => ReviewEntity, {
    name: 'deleteReview',
  })
  async onDeleteReview(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe('deleteReview');
  }
}
