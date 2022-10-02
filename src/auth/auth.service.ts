import { randomBytes } from 'crypto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express'

import { SignUpInput } from './signup-input';
import User from '../user/user-type';
import { SignInInput } from './signin-input';
import Login from './login-type';
import { JwtPayload } from './jwt-payload.interface';
import { PrismaService } from 'src/prisma.service';
import { RefreshTokenPayload } from './refreshToken-payload.interface';

@Injectable()
export class AuthService {
  constructor(

    private jwtService: JwtService,
    private prisma: PrismaService
  ) { }

  async signUp(signupInput: SignUpInput): Promise<User> {
    const { email, username, password } = signupInput;
    const salt = randomBytes(32);

    const hashedPassword = await argon2.hash(password, { salt });
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          salt: salt.toString(),
          profile: {
            create: {

            }
          }
        },
        include: {
          profile: true
        }
      });
      return user;
    } catch (e) {
      console.log(e);
      if (e.code === 'P2002') {
        throw new BadRequestException('User exist')
      }

    }
  }


  async generateRefreshToken(data: RefreshTokenPayload) {
    return await this.jwtService.signAsync(data, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d'
    })
  }

  async signIn(signInInput: SignInInput, res: Response): Promise<Login> {
    const { username, password } = signInInput;
    const user = await this.prisma.user.findFirst({

      where: { username }, include: {
        profile: true
      }
    });

    if (!user) {
      throw new NotFoundException();
    }
    const result = await argon2.verify(user.password, password, {
      salt: Buffer.from(user.salt),
    });
    if (!result) {
      throw new NotFoundException();
    }
    const payload: JwtPayload = { id: user.id, username: user.username, imgUrl: user.imgUrl };
    const token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.generateRefreshToken({ id: user.id, tokenVersion: user.tokenVersion });
    res.cookie('_sid', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });


    return { token };
  }
}
