import { Module } from '@nestjs/common';
import { AmenitiesResolver } from './amenities.resolver';
import { AmenitiesService } from './amenities.service';

@Module({
  providers: [AmenitiesResolver, AmenitiesService],
})
export class AmenitiesModule {}
