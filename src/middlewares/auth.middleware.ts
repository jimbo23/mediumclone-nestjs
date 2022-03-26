import { ExpressRequest } from '@app/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    console.log(req.headers);
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    // tell middleware to finish and move on
    next();
  }
}
