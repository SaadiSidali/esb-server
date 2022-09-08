import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @IsNotEmpty()
  @Field()
  username: string;

  @MinLength(8)
  @MaxLength(255)
  @Field()
  password: string;
}
