import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import User from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Profile)
        private profilesRepository: Repository<Profile>,
    ) { }

    async getProfile(userId: number): Promise<Profile> {
        const result = await this.profilesRepository.findOne({
            where: { userId: userId },
        });
        return result;
    }
}
