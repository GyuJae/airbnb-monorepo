import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class CreateUserInput extends PickType(
  UserEntity,
  ['email', 'firstName', 'gender', 'language', 'lastName', 'password', 'role'],
  InputType,
) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity | null;
}
