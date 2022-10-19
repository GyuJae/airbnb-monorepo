import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class WishlistsService {
  constructor(private readonly prisma: PrismaService) {}

  async createWishlist(
    { name }: CreateWishlistInput,
    user: UserEntity,
  ): Promise<CreateWishlistOutput> {
    try {
      const existWishlist = await this.prisma.wishlist.findUnique({
        where: {
          name,
        },
        select: {
          id: true,
        },
      });
      if (existWishlist) throw new Error('Already exist wishlist by this name');
      const wishlist = await this.prisma.wishlist.create({
        data: {
          name,
          userId: user.id,
        },
      });
      return {
        ok: true,
        wishlist,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async readWishlists({
    take = 20,
    lastId,
    userId,
  }: ReadWishlistsInput): Promise<ReadWishlistOutput> {
    try {
      const wishlists = await this.prisma.wishlist.findMany({
        where: {
          userId,
        },
        take,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
        }),
      });
      return {
        ok: true,
        wishlists,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        wishlists: [],
      };
    }
  }

  async deleteWishlist(
    { wishlistId }: DeleteWishlistInput,
    user: UserEntity,
  ): Promise<DeleteWishlistOutput> {
    try {
      const wishlist = await this.prisma.wishlist.findUnique({
        where: {
          id: wishlistId,
        },
      });
      if (!wishlist)
        throw new Error(`Not Found wishlist by this wishlistId: ${wishlistId}`);
      if (wishlist.userId !== user.id) throw new Error('No Authorzation');
      await this.prisma.wishlist.delete({
        where: {
          id: wishlist.id,
        },
      });
      return {
        ok: true,
        wishlist,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
