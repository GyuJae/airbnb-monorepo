import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@ObjectType()
export class CoreOutput {
  @Field(() => Boolean)
  @IsBoolean()
  ok: boolean;
  
  @Field(() => String, { nullable: true })
  @IsString()
  error?: string | null;
}
