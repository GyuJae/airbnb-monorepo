import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(
    { text, roomId }: CreateReviewInput,
    user: UserEntity,
  ): Promise<CreateReviewOutput> {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
        },
      });
      if (!room) throw new Error('Not Found Room by this roomId');
      const review = await this.prisma.review.create({
        data: {
          text,
          roomId: room.id,
          userId: user.id,
        },
      });
      return {
        ok: true,
        review,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async deleteReview(
    { id: reviewId }: DeleteReviewInput,
    user: UserEntity,
  ): Promise<DeleteReviewOutput> {
    try {
      const existReview = await this.prisma.review.findUnique({
        where: {
          id: reviewId,
        },
        select: {
          id: true,
          userId: true,
        },
      });
      if (!existReview)
        throw new Error(`Not Found Review by this reviewId ${reviewId}`);
      if (existReview.userId !== user.id) throw new Error('No Authorization.');

      const review = await this.prisma.review.delete({
        where: {
          id: existReview.id,
        },
      });

      return {
        ok: true,
        review,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async readReviews({
    roomId,
    take = 20,
    lastId,
  }: ReadReviewsInput): Promise<ReadReviewsOutput> {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
        },
      });
      if (!room) throw new Error(`Not found roomd by this roomId: ${roomId}`);
      const reviews = await this.prisma.review.findMany({
        where: {
          roomId: room.id,
        },
        take,
        skip: lastId ? 1 : 0,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
        }),
      });
      return {
        ok: true,
        reviews,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        reviews: [],
      };
    }
  }
}
