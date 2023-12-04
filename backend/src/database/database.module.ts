import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  exports: [DatabaseService],
  controllers: [DatabaseController], 
  providers: [DatabaseService], 
})
export class DatabaseModule {}
