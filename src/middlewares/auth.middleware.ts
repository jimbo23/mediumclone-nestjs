import { JWT_SECRET } from '@app/config';
import { ExpressRequest } from '@app/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    // tell middleware to finish and move on
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decode = verify(token, JWT_SECRET);
      console.log('user', decode);
    } catch (error) {
      req.user = null;
      next();
    }

    next();
  }
}
