import { Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards, Req } from '@nestjs/common';
import { Profile } from './profile-type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import User from './user-type';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Resolver((of) => User)
export class ProfileResolver {
    constructor(private userServise: UserService) { }

    @Query((returns) => User)
    async me(@GetUser() user) {
        return user;
    }

    @ResolveField()
    async profile(@Parent() user: User) {
        return this.userServise.getProfile(user.id);
    }
}
