import { Inject } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Subscription,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from '../auth/auth.decorator';
import { PUB_SUB } from '../core/core.constants';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { MeOutput } from './dtos/me.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @ResolveField(() => Boolean)
  isMe(@Parent() user: UserEntity, @CurrentUser() currentUser: UserEntity) {
    if (!currentUser) return false;
    return user.id === currentUser.id;
  }

  @Query(() => MeOutput)
  me(@CurrentUser() currentUser: UserEntity): MeOutput {
    return {
      user: currentUser || null,
    };
  }

  @Mutation(() => CreateUserOutput)
  async createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    const result = await this.usersService.createUser(createUserInput);
    if (result.ok && result.user)
      this.pubSub.publish('createUser', {
        createUser: result.user,
      });
    return result;
  }

  @Subscription(() => UserEntity, {
    name: 'createUser',
  })
  onCreateUser() {
    return this.pubSub.asyncIterator('createUser');
  }
}
