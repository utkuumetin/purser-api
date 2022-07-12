import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;
    if (!token) return false;

    try {
      const content = this.authService.validateToken(token);
      request.user = content.id;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Authorization failed',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
