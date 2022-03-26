import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req, res, next) {
    console.log(req.headers);

    // tell middleware to finish and move on
    next();
  }
}
