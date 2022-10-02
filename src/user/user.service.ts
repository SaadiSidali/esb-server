import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrismaService } from 'src/prisma.service';
import { Repository } from 'typeorm';
import { Profile } from './profile-type';
import { UpdateProfileInput } from './update-profile-input';
import User from './user-type';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService
  ) { }

  async getProfile(user: User): Promise<Profile> {

    const result = await this.prisma.profile.findFirst({
      where: { id: user.profile.id },
    });
    return result;
  }

  async updateProfile(
    updateProfileInput: UpdateProfileInput,
    user: User,
  ): Promise<boolean> {
    const update = {}
    update[updateProfileInput.field] = updateProfileInput.value
    await this.prisma.profile.update({
      where: { id: user.profile.id }, data: {
        ...update
      }
    })
    return true;
  }
}
