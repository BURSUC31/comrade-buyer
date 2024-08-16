import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(CustomAuthGuard.name);

  handleRequest(err: { message: any }, user: any, info: { message: any }) {
    if (err) {
      this.logger.error(`Error in AuthGuard: ${err.message}`);
      throw err;
    }
    if (info) {
      this.logger.warn(`Info in AuthGuard: ${info.message}`);
      throw new UnauthorizedException(info.message);
    }
    if (!user) {
      this.logger.warn('User not found in request');
      throw new UnauthorizedException();
    }
    return user;
  }
}
