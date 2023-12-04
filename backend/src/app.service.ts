import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  // async getHello(): Promise<any> {
  //   try {
  //     // const tmp1 = await this.databaseService.createUser("jb", "face", "fm", 5);
  //     const tmp1 = await this.databaseService.addBlockedUser("jboss", "FAFO");
  //     // const tmp = null;
  //     const tmp = await this.databaseService.getUserInformation("jboss");
  //     console.log(tmp1);
  //     if (tmp == null)
  //       return ("null");
  //     return tmp;
  //   } catch (error) {
  //     throw new Error("Erreur : impossible de créer les données utilisateur depuis getHello: Fichier app.service. " + error.message);
  //   }
  // }
}
