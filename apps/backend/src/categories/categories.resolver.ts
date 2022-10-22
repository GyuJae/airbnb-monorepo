import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../core/core.constants';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import { ReadCategoriesOutput } from './dtos/read-categories.dto';
import { CategoryEntity } from './entities/category.entity';

@Resolver(() => CategoryEntity)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => ReadCategoriesOutput)
  async readCategories(): Promise<ReadCategoriesOutput> {
    return this.categoriesService.readCategories();
  }

  @Mutation(() => CreateCategoryOutput)
  async createCategory(
    @Args('input') createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    const result = await this.categoriesService.createCategory(
      createCategoryInput,
    );
    if (result.ok && result.category) {
      this.pubSub.publish('createCategory', {
        createCategory: result.category,
      });
    }
    return result;
  }

  @Subscription(() => CategoryEntity, {
    name: 'createCategory',
  })
  onCreateCategory() {
    return this.pubSub.asyncIterator('createCategory');
  }
}
