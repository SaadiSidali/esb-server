import { Controller, FileTypeValidator, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express'
import { InjectRepository } from '@nestjs/typeorm';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import User from 'src/user/user-type';
import UserEntity from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'),)
    async uploadFile(
        @Req() req: Request,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: 'image/*' }),
                ],
            }),
        )
        file: Express.Multer.File, @GetUser() user: User) {
        console.log(user);
        const fileUrl = `${req.protocol}://${req.get('Host')}/${file.filename}`


        const currentUser = await this.usersRepository.findOne({ where: { id: user.id } })
        currentUser.imgUrl = fileUrl;
        await currentUser.save()
        return true
    }
}
