import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user/user.service';

@Injectable()
export class ValidateUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.userId, 10);

    console.log(req.params);

    if (isNaN(userId)) {
      throw new NotFoundException('User ID is not valid');
    }

    console.log('1');

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    console.log('2');

    next();
  }
}
