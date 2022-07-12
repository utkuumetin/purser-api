import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { User } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signup(@Body() authDto: AuthDto) {
    return await this.authService.signup(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(@Body() authDto: AuthDto) {
    return await this.authService.signin(authDto);
  }

  @UseGuards(AuthGuard)
  @Get('/test-guard')
  async testGuard(@User() user: string) {
    return user;
  }
}
