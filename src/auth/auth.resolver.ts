import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import Token from './token-type';
import { SignInInput } from './signin-input';
import { SignUpInput } from './signup-input';
import User from '../user/user-type';
import { JwtAuthGuard } from './jwt-auth.guard';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

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
}
