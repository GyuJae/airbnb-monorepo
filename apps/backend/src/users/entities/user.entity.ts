import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Gender, Language, Role, User } from '@prisma/client';
import { IsEmail, IsEnum, IsString, Length, MaxLength } from 'class-validator';
import { CoreEntity } from '../../core/entites/core.entity';

@ObjectType()
export class UserEntity extends CoreEntity implements User {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @Length(8, 20)
  password: string;

  @Field(() => String)
  @IsString()
  @MaxLength(20)
  firstName: string;

  @Field(() => String)
  @IsString()
  @MaxLength(20)
  lastName: string;

  @Field(() => String, { nullable: true })
  @IsString()
  avatar: string;

  @Field(() => Role)
  @IsEnum(Role)
  role: Role;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field(() => Language)
  @IsEnum(Language)
  language: Language;

  @Field(() => [String])
  chattingRoomId: string[];
}

registerEnumType(Role, {
  name: 'role',
  description: 'User Role Guest Or Host',
});
registerEnumType(Gender, {
  name: 'gender',
  description: 'Male or Female',
});
registerEnumType(Language, {
  name: 'language',
  description: 'kr, en',
});
