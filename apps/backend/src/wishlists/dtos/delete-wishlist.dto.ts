import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { WishlistEntity } from '../entities/wishlist.entity';

@InputType()
export class DeleteWishlistInput {
  @Field(() => String)
  @IsString()
  wishlistId: string;
}

@ObjectType()
export class DeleteWishlistOutput extends CoreOutput {
  @Field(() => WishlistEntity, { nullable: true })
  wishlist?: WishlistEntity | null;
}
