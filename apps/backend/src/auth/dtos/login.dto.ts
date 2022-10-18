import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../core/dtos/core-output.dto';
import { UserEntity } from '../../users/entities/user.entity';

@InputType()
export class LoginInput extends PickType(
  UserEntity,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string | null;
}
