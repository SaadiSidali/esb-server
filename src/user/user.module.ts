import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { ProfileResolver } from './user.resolver';
import { UserService } from './user.service';
import User from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  exports: [TypeOrmModule.forFeature([User])],
  providers: [ProfileResolver, UserService],
})
export class UserModule {}
