import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsResolver } from './wishlists.resolver';

describe('WishlistsResolver', () => {
  let resolver: WishlistsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistsResolver],
    }).compile();

    resolver = module.get<WishlistsResolver>(WishlistsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
