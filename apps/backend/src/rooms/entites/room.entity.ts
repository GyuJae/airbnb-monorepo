import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Room, RoomKind } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsString, Length } from 'class-validator';
import { CoreEntity } from '../../core/entites/core.entity';

@ObjectType()
export class RoomEntity extends CoreEntity implements Room {
  @Field(() => String)
  @IsString()
  @Length(3, 20)
  name: string;

  @Field(() => String)
  @IsString()
  hostId: string;

  @Field(() => String)
  @IsString()
  @Length(2, 40)
  country: string;

  @Field(() => String)
  @IsString()
  @Length(2, 40)
  city: string;

  @Field(() => Int)
  @IsInt()
  price: number;

  @Field(() => Int)
  @IsInt()
  rooms: number;

  @Field(() => Int)
  @IsInt()
  toilets: number;

  @Field(() => String)
  @IsString()
  @Length(0, 400)
  description: string;

  @Field(() => String)
  @IsString()
  @Length(0, 400)
  address: string;

  @Field(() => Boolean)
  @IsBoolean()
  petFriendly: boolean;

  @Field(() => RoomKind)
  @IsEnum(RoomKind)
  kind: RoomKind;

  @Field(() => [String])
  amenityIDs: string[];

  @Field(() => String)
  @IsString()
  categoryId: string;

  @Field(() => [String])
  wishlistIDs: string[];
}

registerEnumType(RoomKind, {
  name: 'RoomKind',
  description: 'ENTIRE_PLACE, PRIVATE_ROOM, SHARED_ROOM',
});
