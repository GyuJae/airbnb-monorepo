import { Field, ObjectType } from '@nestjs/graphql';
import { Amenity } from '@prisma/client';
import { IsString, MaxLength } from 'class-validator';
import { CoreEntity } from '../../core/entites/core.entity';

@ObjectType()
export class AmenityEntity extends CoreEntity implements Amenity {
  @Field(() => String)
  @IsString()
  @MaxLength(20)
  name: string;

  @Field(() => String)
  @IsString()
  @MaxLength(200)
  description: string;

  @Field(() => [String])
  roomIDS: string[];
}
