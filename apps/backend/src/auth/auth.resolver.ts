import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../core/core.constants';
import { UserEntity } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    const result = await this.authService.login(loginInput);
    if (result.ok && result.user) {
      this.pubSub.publish('login', {
        login: result.user,
      });
    }
    return result;
  }

  @Subscription(() => UserEntity, {
    name: 'login',
  })
  onLogin() {
    return this.pubSub.asyncIterator('login');
  }
}
