import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JWT_KEY } from './auth.constants';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = jwt.verify(token.toString(), this.config.get(JWT_KEY));

      if (typeof decoded === 'object' && 'id' in decoded) {
        const user = await this.userService.findById(decoded['id']);
        req['user'] = user;
      }
    }
    next();
  }
}
