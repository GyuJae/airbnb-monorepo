import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { CategoryEntity } from '../entities/category.entity';

@ObjectType()
export class ReadCategoriesOutput extends CoreOutput {
  @Field(() => [CategoryEntity])
  categories: CategoryEntity[];
}
