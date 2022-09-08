import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Profile } from './profile-type';

@ObjectType('user')
export default class User {
    @Field((type) => ID)
    id: number;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field((type) => Profile)
    profile: Profile;
}
