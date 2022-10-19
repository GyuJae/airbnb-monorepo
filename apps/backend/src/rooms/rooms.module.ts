import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';

@Module({
  providers: [RoomsService, RoomsResolver],
})
export class RoomsModule {}
