import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { PaginationInput } from '../../core/dtos/pagination-input.dto';
import { WishlistEntity } from '../entities/wishlist.entity';

@InputType()
export class ReadWishlistsInput extends PaginationInput {
  @Field(() => String)
  @IsString()
  userId: string;
}

@ObjectType()
export class ReadWishlistOutput extends CoreOutput {
  @Field(() => [WishlistEntity])
  wishlists: WishlistEntity[];
}
