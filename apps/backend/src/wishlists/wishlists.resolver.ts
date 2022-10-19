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
  CreateWishlistInput,
  CreateWishlistOutput,
} from './dtos/create-wishlist.dto';
import { WishlistEntity } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Resolver(() => WishlistEntity)
export class WishlistsResolver {
  constructor(private readonly wishlistsService: WishlistsService) {}

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
