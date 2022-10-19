import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { CategoryEntity } from '../entities/category.entity';

@InputType()
export class CreateCategoryInput extends PickType(
  CategoryEntity,
  ['name'],
  InputType,
) {}

@ObjectType()
export class CreateCategoryOutput extends CoreOutput {
  @Field(() => CategoryEntity, { nullable: true })
  category?: CategoryEntity | null;
}
