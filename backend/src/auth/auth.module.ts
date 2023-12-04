import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [DatabaseModule], 
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule
{

}