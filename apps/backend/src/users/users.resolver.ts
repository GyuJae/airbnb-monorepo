import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Subscription,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PubSub } from 'mercurius';
import { CurrentUser } from '../auth/auth.decorator';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { MeOutput } from './dtos/me.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

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
    @Context('pubsub') pubSub: PubSub,
  ): Promise<CreateUserOutput> {
    const result = await this.usersService.createUser(createUserInput);
    if (result.ok && result.user)
      pubSub.publish({
        topic: 'createUser',
        payload: {
          createUser: result.user,
        },
      });
    return result;
  }

  @Subscription(() => UserEntity, {
    name: 'createUser',
  })
  onCreateUser(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe('createUser');
  }
}
