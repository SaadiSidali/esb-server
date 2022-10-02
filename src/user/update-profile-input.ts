import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { profileField } from './profile-field.enum';

@InputType()
export class UpdateProfileInput {
  @IsNotEmpty()
  @IsEnum(profileField)
  @Field()
  field: string;

  @Field()
  value: string;
}
