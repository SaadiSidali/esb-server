import { Controller, FileTypeValidator, ParseFilePipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express'
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import User from 'src/user/user-type';
import { PrismaService } from 'src/prisma.service';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { RefreshTokenPayload } from 'src/auth/refreshToken-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class AppController {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,

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


        const currentUser = await this.prisma.user.update({
            where: { id: user.id }, data: {
                imgUrl: fileUrl
            }
        })
        return true
    }

    @Post('/refresh_token')
    async generateAccesToken(@Req() req: Request, @Res() res: Response) {

        const token = req.cookies._sid
        if (!token) {
            return { ok: false, accessToken: '' }
        }
        let payload: RefreshTokenPayload = null
        try {
            payload = await
                this.jwtService.verifyAsync(token, { secret: process.env.REFRESH_TOKEN_SECRET });
        } catch (error) {
            return { ok: false, accessToken: '' }

        }

        const user = await this.prisma.user.findFirst({ where: { id: payload.id } })
        const access_payload: JwtPayload = { id: user.id, username: user.username, imgUrl: user.imgUrl };
        const access_token = await this.jwtService.signAsync(access_payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRESIN,
        });

        const newRefreshtoken = await this.generateRefreshToken({ id: user.id, tokenVersion: user.tokenVersion })
        res.cookie('_sid', newRefreshtoken, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        return res.send({ ok: true, accessToken: access_token })
    }

    async generateRefreshToken(data: RefreshTokenPayload) {
        return await this.jwtService.signAsync(data, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '7d'
        })
    }

}
