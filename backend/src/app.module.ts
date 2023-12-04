import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, HttpModule, ChatModule, MulterModule.register({
    dest: './uploads',
  }), ServeStaticModule.forRoot({
    rootPath: '/', // Chemin vers le dossier de vos fichiers
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
