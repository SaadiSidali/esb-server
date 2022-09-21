import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import Token from './login-type';
import { SignInInput } from './signin-input';
import { SignUpInput } from './signup-input';
import User from '../user/user-type';
import { Request, Response } from 'express';
import { GetReq, GetRes } from './express.decorator';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private authService: AuthService) { }

  @Query((returns) => String)
  sayHi() {
    return 'hi';
  }

  @Mutation((returns) => User)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation((returns) => Token)
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Mutation(returns => String)
  test(@GetReq() req: Request, @GetRes() res: Response) {
    res.cookie('hi', 'sidali', {
      httpOnly: true
    })

    return this.authService.generateRefreshToken()
  }
}
