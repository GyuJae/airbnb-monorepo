import { Field, ObjectType } from '@nestjs/graphql';
import { Wishlist } from '@prisma/client';
import { IsString, MaxLength } from 'class-validator';
import { CoreEntity } from '../../core/entites/core.entity';

@ObjectType()
export class WishlistEntity extends CoreEntity implements Wishlist {
  @Field(() => String)
  @IsString()
  @MaxLength(30)
  name: string;

  @Field(() => String)
  @IsString()
  userId: string;

  @Field(() => [String])
  roomIDS: string[];
}
