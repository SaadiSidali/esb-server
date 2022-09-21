import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { UpdateProfileInput } from './update-profile-input';
import User from './user-type';
import UserEntity from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) { }

  async getProfile(user: User): Promise<Profile> {
    const result = await this.profilesRepository.findOne({
      where: { id: user.profile.id },
    });
    return result;
  }

  async updateProfile(
    updateProfileInput: UpdateProfileInput,
    user: User,
  ): Promise<boolean> {
    const profile = await this.getProfile(user);
    const { field, value } = updateProfileInput;
    profile[field] = value;
    await this.profilesRepository.save(profile);
    return true;
  }
}
