import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export default class Login {
  @Field()
  token: string;
}
