import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { UpdateProfileInput } from './update-profile-input';
import User from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async getProfile(userId: number): Promise<Profile> {
    const result = await this.profilesRepository.findOne({
      where: { userId: userId },
    });
    return result;
  }

  async updateProfile(
    updateProfileInput: UpdateProfileInput,
    userId: number,
  ): Promise<boolean> {
    const profile = await this.getProfile(userId);
    const { field, value } = updateProfileInput;
    profile[field] = value;
    await this.profilesRepository.save(profile);
    return true;
  }
}
