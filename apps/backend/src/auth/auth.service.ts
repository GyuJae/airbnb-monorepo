import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JWT_KEY } from './auth.constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) throw new Error('Not Found User by this email');

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) throw new Error('Wrong Password');

      const token = jwt.sign({ id: user.id }, this.config.get(JWT_KEY));

      return {
        ok: true,
        token,
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
