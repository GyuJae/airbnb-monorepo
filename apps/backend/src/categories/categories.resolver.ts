import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'mercurius';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import { ReadCategoriesOutput } from './dtos/read-categories.dto';
import { CategoryEntity } from './entities/category.entity';

@Resolver(() => CategoryEntity)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => ReadCategoriesOutput)
  async readCategories(): Promise<ReadCategoriesOutput> {
    return this.categoriesService.readCategories();
  }

  @Mutation(() => CreateCategoryOutput)
  async createCategory(
    @Args('input') createCategoryInput: CreateCategoryInput,
    @Context('pubsub') pubSub: PubSub,
  ): Promise<CreateCategoryOutput> {
    const result = await this.categoriesService.createCategory(
      createCategoryInput,
    );
    if (result.ok && result.category) {
      pubSub.publish({
        topic: 'createCategory',
        payload: {
          createCategory: result.category,
        },
      });
    }
    return result;
  }

  @Subscription(() => CategoryEntity, {
    name: 'createCategory',
  })
  onCreateCategory(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe('createCategory');
  }
}
