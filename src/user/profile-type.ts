import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Profile {
    @Field()
    id: number;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    phoneNumber: string;

    @Field()
    levelOfStudy: string;

    @Field()
    expectedSalary: string;

    @Field()
    wilaya: string;

    @Field()
    biography: string;

    @Field()
    repoUrl: string;

    @Field()
    linkedInUrl: string;

    @Field()
    portfolio: string;
}
