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
import {
  DeleteMessageInput,
  DeleteMessageOutput,
} from './dtos/delete-message.dto';
import {
  ReadMessagesInput,
  ReadMessagesOutput,
} from './dtos/read-messages.dto';
import { ChattingRoomEntity } from './entities/chattingRoom.entity';
import { MessageEntity } from './entities/message.entity';

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

  async deleteMessage(
    { messageId }: DeleteMessageInput,
    currentUser: UserEntity,
  ): Promise<DeleteMessageOutput> {
    try {
      const message = await this.prisma.message.findFirst({
        where: {
          id: messageId,
          userId: currentUser.id,
        },
      });
      if (!message)
        throw new Error(`Not Found Message by this message id ${messageId}`);

      await this.prisma.message.delete({
        where: {
          id: message.id,
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

  async readMessages({
    chattingRoomId,
    take,
    lastId,
  }: ReadMessagesInput): Promise<ReadMessagesOutput> {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          chattingRoomId,
        },
        take,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
        }),
      });
      return {
        ok: true,
        messages,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.messages,
        messages: [],
      };
    }
  }

  async user(message: MessageEntity): Promise<UserEntity> {
    return this.prisma.user.findFirst({
      where: {
        messages: {
          some: {
            id: message.id,
          },
        },
      },
    });
  }
}
