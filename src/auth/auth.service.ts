import { randomBytes } from 'crypto';

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { SignUpInput } from './signup-input';
import User from '../user/user.entity';
import { SignInInput } from './signin-input';
import Login from './login-type';
import { JwtPayload } from './jwt-payload.interface';
import { Profile } from 'src/user/profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) { }

  async signUp(signupInput: SignUpInput): Promise<User> {
    const { email, username, password } = signupInput;
    const salt = randomBytes(32);

    const hashedPassword = await argon2.hash(password, { salt });
    const user = await this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      salt: salt.toString(),
    });
    try {
      // user.profile = profile;
      const profile = await this.profileRepository.create({});
      await this.profileRepository.save(profile);
      user.profile = profile;
      await user.save();
    } catch (e) {
      if (e.code === '23505' || e.code === '22021') {
        throw new BadRequestException('User Exists');
      }
      console.log(e);
    }

    return user;
  }


  async generateRefreshToken() {
    this.jwtService.sign({}, {
      secret: ''
    })
    return 'hiiii'
  }

  async signIn(signInInput: SignInInput,): Promise<Login> {
    const { username, password } = signInInput;
    const user = await this.usersRepository.findOne({
      where: { username }, relations: {
        profile: true
      }
    });


    console.log(user);

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

    return { token };
  }
}
