import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from '../auth/auth.decorator';
import { PUB_SUB } from '../core/core.constants';
import { UserEntity } from '../users/entities/user.entity';
import {
  CreateWishlistInput,
  CreateWishlistOutput,
} from './dtos/create-wishlist.dto';
import {
  DeleteWishlistInput,
  DeleteWishlistOutput,
} from './dtos/delete-wishlist.dto';
import {
  ReadWishlistOutput,
  ReadWishlistsInput,
} from './dtos/read-wishlists.dto';
import { WishlistEntity } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Resolver(() => WishlistEntity)
export class WishlistsResolver {
  constructor(
    private readonly wishlistsService: WishlistsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => ReadWishlistOutput)
  async readWishlists(
    @Args('input') readWishlistsInput: ReadWishlistsInput,
  ): Promise<ReadWishlistOutput> {
    return this.wishlistsService.readWishlists(readWishlistsInput);
  }

  @Mutation(() => CreateWishlistOutput)
  async createWishlist(
    @Args('input') createWishlistInput: CreateWishlistInput,
    @CurrentUser() user: UserEntity,
  ): Promise<CreateWishlistOutput> {
    const result = await this.wishlistsService.createWishlist(
      createWishlistInput,
      user,
    );
    if (result.ok && result.wishlist) {
      this.pubSub.publish('createWishlist', {
        createWishlist: result.wishlist,
      });
    }
    return result;
  }

  @Subscription(() => WishlistEntity, {
    name: 'createWishlist',
  })
  onCreateWishlist() {
    return this.pubSub.asyncIterator('createWishlist');
  }

  @Mutation(() => DeleteWishlistOutput)
  async deleteWishlist(
    @Args('input') deleteWishlistInput: DeleteWishlistInput,
    @CurrentUser() user: UserEntity,
  ): Promise<DeleteWishlistOutput> {
    const result = await this.wishlistsService.deleteWishlist(
      deleteWishlistInput,
      user,
    );
    if (result.ok && result.wishlist) {
      this.pubSub.publish('deleteWishlist', {
        deleteWishlist: result.wishlist,
      });
    }
    return result;
  }

  @Subscription(() => WishlistEntity, {
    name: 'deleteWishlist',
  })
  async onDelteWishlist() {
    return this.pubSub.asyncIterator('deleteWishlist');
  }
}
