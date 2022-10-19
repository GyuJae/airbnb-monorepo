import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { AmenityEntity } from '../entities/amenity.entity';

@InputType()
export class CreateAmenityInput extends PickType(
  AmenityEntity,
  ['name', 'description'],
  InputType,
) {}

@ObjectType()
export class CreateAmenityOutput extends CoreOutput {
  @Field(() => AmenityEntity, { nullable: true })
  amenity?: AmenityEntity | null;
}
