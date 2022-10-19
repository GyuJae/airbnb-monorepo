import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../users/entities/user.entity';
import {
  CreateChattingRoomInput,
  CreateChattingRoomOutput,
} from './dtos/create-chatting-room.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createChattingRoom(
    { roomId }: CreateChattingRoomInput,
    currentUser: UserEntity,
  ): Promise<CreateChattingRoomOutput> {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
        select: {
          hostId: true,
        },
      });
      if (!room) throw new Error(`Not Found room by this roomId ${roomId}`);
      const chattingRoom = await this.prisma.chattingRoom.findFirst({
        where: {
          roomId,
          users: {
            every: {
              AND: [{ id: room.hostId }, { id: currentUser.id }],
            },
          },
        },
      });
      if (chattingRoom) {
        return {
          ok: false,
          error: 'Alread exists ChattingRoom',
          chattingRoom,
        };
      }
      const newChattingRoom = await this.prisma.chattingRoom.create({
        data: {
          roomId,
          users: {
            connect: [{ id: room.hostId }, { id: currentUser.id }],
          },
        },
      });
      return {
        ok: true,
        chattingRoom: newChattingRoom,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
