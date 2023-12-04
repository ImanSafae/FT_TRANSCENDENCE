import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get('uploads/:filename')
    async serveImage(@Param('filename') filename: string, @Res() res: Response)
    {
      const root = join(__dirname, '..', 'uploads'); // Chemin vers le dossier de vos fichiers statiques sur le serveur
      res.sendFile(filename, { root });
    }
}

