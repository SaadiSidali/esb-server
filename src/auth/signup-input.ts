import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @IsNotEmpty()
  @Field()
  username: string;

  @IsEmail()
  @Field()
  email: string;

  @MinLength(8)
  @MaxLength(255)
  @Field()
  password: string;
}
