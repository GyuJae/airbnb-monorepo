import {
  Args,
  Mutation,
  Resolver,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { AmenitiesService } from './amenities.service';
import {
  CreateAmenityInput,
  CreateAmenityOutput,
} from './dtos/create-amenity.dto';
import { PubSub } from 'mercurius';
import { AmenityEntity } from './entities/amenity.entity';

@Resolver(() => AmenityEntity)
export class AmenitiesResolver {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Mutation(() => CreateAmenityOutput)
  async createAmenity(
    @Args('input') createAmenitiesInput: CreateAmenityInput,
    @Context('pubsub') pubSub: PubSub,
  ): Promise<CreateAmenityOutput> {
    const result = await this.amenitiesService.createAmenity(
      createAmenitiesInput,
    );
    if (result.ok && result.amenity) {
      pubSub.publish({
        topic: 'createAmenity',
        payload: {
          createAmenity: result.amenity,
        },
      });
    }
    return result;
  }

  @Subscription(() => AmenityEntity, {
    name: 'createAmenity',
  })
  async onCreateAmenity(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe('createAmenitys');
  }
}
