import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreateRoomInput, CreateRoomOutput } from './dtos/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(
    createRoomInput: CreateRoomInput,
    user: UserEntity,
  ): Promise<CreateRoomOutput> {
    try {
      if (user.role !== Role.HOST) throw new Error('You are not host');
      const room = await this.prisma.room.create({
        data: {
          ...createRoomInput,
          hostId: user.id,
        },
      });
      return {
        ok: true,
        room,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
