import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { WishlistEntity } from '../entities/wishlist.entity';

@InputType()
export class CreateWishlistInput extends PickType(
  WishlistEntity,
  ['name'],
  InputType,
) {}

@ObjectType()
export class CreateWishlistOutput extends CoreOutput {
  @Field(() => WishlistEntity, { nullable: true })
  wishlist?: WishlistEntity | null;
}
