import { Test, TestingModule } from '@nestjs/testing';
import { RoomsResolver } from './rooms.resolver';

describe('RoomsResolver', () => {
  let resolver: RoomsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsResolver],
    }).compile();

    resolver = module.get<RoomsResolver>(RoomsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
