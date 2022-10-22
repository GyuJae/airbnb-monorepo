import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../core/core.constants';
import { AmenitiesService } from './amenities.service';
import {
  CreateAmenityInput,
  CreateAmenityOutput,
} from './dtos/create-amenity.dto';
import { AmenityEntity } from './entities/amenity.entity';

@Resolver(() => AmenityEntity)
export class AmenitiesResolver {
  constructor(
    private readonly amenitiesService: AmenitiesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => CreateAmenityOutput)
  async createAmenity(
    @Args('input') createAmenitiesInput: CreateAmenityInput,
  ): Promise<CreateAmenityOutput> {
    const result = await this.amenitiesService.createAmenity(
      createAmenitiesInput,
    );
    if (result.ok && result.amenity) {
      this.pubSub.publish('createAmenity', {
        createAmenity: result.amenity,
      });
    }
    return result;
  }

  @Subscription(() => AmenityEntity, {
    name: 'createAmenity',
  })
  async onCreateAmenity() {
    return this.pubSub.asyncIterator('createAmenitys');
  }
}
