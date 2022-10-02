import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProfileResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [],
  exports: [],
  providers: [PrismaService, ProfileResolver, UserService,],
})
export class UserModule { }
