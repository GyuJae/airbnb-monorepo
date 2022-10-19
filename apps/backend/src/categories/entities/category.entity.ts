import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from '../../core/entites/core.entity';

@ObjectType()
export class CategoryEntity extends CoreEntity implements Category {
  @Field(() => String)
  @IsString()
  @Length(1, 25)
  name: string;
}
