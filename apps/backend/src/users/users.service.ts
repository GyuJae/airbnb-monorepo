import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser({
    email,
    password,
    ...restInput
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (existUser) throw new Error('This Email already used');

      const hashPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashPassword,
          ...restInput,
        },
      });

      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
