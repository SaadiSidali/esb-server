import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.development.env',
});

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app/app.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [

    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),

    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = randomUUID()

          const fileType = file.mimetype.split('/')[1]

          cb(null, fileName + '.' + fileType)
        }
      })
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, JwtService]

})
export class AppModule { }
