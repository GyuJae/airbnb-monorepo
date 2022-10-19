import { Field, ObjectType } from '@nestjs/graphql';
import { Amenity } from '@prisma/client';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from '../../core/entites/core.entity';

@ObjectType()
export class AmenityEntity extends CoreEntity implements Amenity {
  @Field(() => String)
  @IsString()
  @Length(1, 20)
  name: string;

  @Field(() => String)
  @IsString()
  @Length(1, 200)
  description: string;

  @Field(() => [String])
  roomIDS: string[];
}
