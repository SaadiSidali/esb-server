import {
    Query,
    Resolver,
    ResolveField,
    Parent,
    Mutation,
    Args,
} from '@nestjs/graphql';
import { UseGuards, Req } from '@nestjs/common';
import { Profile } from './profile-type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import User from './user-type';
import { UserService } from './user.service';
import { UpdateProfileInput } from './update-profile-input';

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
        console.log(user.profile.id);

        return this.userServise.getProfile(user);
    }

    @Mutation((returns) => Boolean)
    async updateProfile(
        @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
        @GetUser() user: User,
    ): Promise<boolean> {
        return this.userServise.updateProfile(updateProfileInput, user);
    }
}
