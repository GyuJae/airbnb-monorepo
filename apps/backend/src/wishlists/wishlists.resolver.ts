import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'mercurius';
import { CurrentUser } from '../auth/auth.decorator';
import { UserEntity } from '../users/entities/user.entity';
import {
  CreateWishlistInput,
  CreateWishlistOutput,
} from './dtos/create-wishlist.dto';
import {
  ReadWishlistOutput,
  ReadWishlistsInput,
} from './dtos/read-wishlists.dto';
import { WishlistEntity } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Resolver(() => WishlistEntity)
export class WishlistsResolver {
  constructor(private readonly wishlistsService: WishlistsService) {}

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
    @Context('pubsub') pubSub: PubSub,
  ): Promise<CreateWishlistOutput> {
    const result = await this.wishlistsService.createWishlist(
      createWishlistInput,
      user,
    );
    if (result.ok && result.wishlist) {
      pubSub.publish({
        topic: 'createWishlist',
        payload: {
          createWishlist: result.wishlist,
        },
      });
    }
    return result;
  }

  @Subscription(() => WishlistEntity, {
    name: 'createWishlist',
  })
  onCreateWishlist(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe('createWishlist');
  }
}
