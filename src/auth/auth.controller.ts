import { 
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('/signup')
    async signup(@Body() authDto: AuthDto) {
        return await this.authService.signup(authDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('/signin')
    async signin(@Body() authDto: AuthDto) {
        return await this.authService.signin(authDto)
    }
}
