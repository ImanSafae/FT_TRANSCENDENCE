import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateScoreDto } from './dto/score.dto';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(
    private readonly prismaService: PrismaService, 
    private readonly dbService: DatabaseService
  ) {}

  @Get('users')
  async getUsers() {
    try {
      const users = await this.prismaService.prisma.userData.findMany();
      return users;
    } catch (error) {
      throw new Error("Erreur : impossible de récupérer les données utilisateur depuis GET.");
    }
  }

  @Post('add_score')
  async add_score(@Body() data: UpdateScoreDto) {
      try {
        console.log("saving scores:", data);
        const res = await this.dbService.saveScore(
          data.user1,
          data.user2,
          data.score1,
          data.score2
        );
        return (res);
      } catch (e) {
        return (null);
      }
  }
}
