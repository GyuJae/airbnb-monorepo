import { Module } from '@nestjs/common';
import { WishlistsResolver } from './wishlists.resolver';
import { WishlistsService } from './wishlists.service';

@Module({
  providers: [WishlistsResolver, WishlistsService],
})
export class WishlistsModule {}
