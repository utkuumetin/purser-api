import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(authDto: AuthDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });
    if (existing) throw new ForbiddenException('Credentials taken');

    const hash = await bcrypt.hash(authDto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: authDto.email, hash },
    });

    return this.signToken(user.id, user.email);
  }

  async signin(authDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const match = bcrypt.compare(authDto.password, user.hash);
    if (!match) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    id: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { id, email };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '12h',
      secret: secret,
    });

    return { access_token: token };
  }

  validateToken(token: string) {
    const cleanToken = token.replace('Bearer', '').trim();
    return this.jwt.verify(cleanToken, {
      publicKey: this.config.get('JWT_SECRET'),
    });
  }
}
