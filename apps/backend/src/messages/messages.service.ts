import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../users/entities/user.entity';
import {
  CreateChattingRoomInput,
  CreateChattingRoomOutput,
} from './dtos/create-chatting-room.dto';
import {
  CreateMessageInput,
  CreateMessageOutput,
} from './dtos/create-message.dto';
import { ChattingRoomEntity } from './entities/chattingRoom.entity';

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
              OR: [{ id: room.hostId }, { id: currentUser.id }],
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

  async users({ id }: ChattingRoomEntity): Promise<UserEntity[]> {
    const chattingRoom = await this.prisma.chattingRoom.findUnique({
      where: {
        id,
      },
      select: {
        users: true,
      },
    });
    return chattingRoom.users;
  }

  async createMessage(
    { text, chattingRoomId }: CreateMessageInput,
    currentUser: UserEntity,
  ): Promise<CreateMessageOutput> {
    try {
      const chattingRoom = await this.prisma.chattingRoom.findFirst({
        where: {
          id: chattingRoomId,
          users: {
            some: {
              id: currentUser.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      if (!chattingRoom)
        throw new Error(
          `Not Found Chatting Room by this chattingRoomId ${chattingRoomId}`,
        );

      const message = await this.prisma.message.create({
        data: {
          text,
          user: {
            connect: {
              id: currentUser.id,
            },
          },
          chattingRoom: {
            connect: {
              id: chattingRoom.id,
            },
          },
        },
      });
      return {
        ok: true,
        message,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
