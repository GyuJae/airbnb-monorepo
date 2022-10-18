import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';

@ObjectType()
export class MeOutput {
  @Field(() => UserEntity, { nullable: true })
  user: UserEntity | null;
}
