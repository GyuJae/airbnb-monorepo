import { Test, TestingModule } from '@nestjs/testing';
import { AmenitiesResolver } from './amenities.resolver';

describe('AmenitiesResolver', () => {
  let resolver: AmenitiesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmenitiesResolver],
    }).compile();

    resolver = module.get<AmenitiesResolver>(AmenitiesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
