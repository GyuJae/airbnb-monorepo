import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';

@Module({
  providers: [ReviewsService, ReviewsResolver],
})
export class ReviewsModule {}
