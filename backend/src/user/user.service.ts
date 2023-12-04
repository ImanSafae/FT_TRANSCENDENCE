import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { UserDataDto } from "./dto";

@Injectable({})
export class UserService
{
    constructor(private databaseservice: DatabaseService) { }
    getUserData(nickname: string)
    {
        // récupérer dans la db les infos de nickname
        // les retourner
    }

    async changePseudo(login: string, newPseudo: string) : Promise <boolean | number>
    {
        try {
            let update: null | string | boolean = await this.databaseservice.updatePseudo(login, newPseudo);
            if (update === null)
            {
                // should never happen
                console.log("user with this pseudo doesn't exist in db??");
                return (500);
            }
            if (update === false) // new user already exists
            {
                console.log("FALSE! pseudo seems to exist already");
                return (false);
            }
            return (true);
        }
        catch (error) {
            console.log("Internal error during nickname change:", error);
        }
    }

    generateImageUrl(filename: string): string {
        return (`http://159.65.54.159:3000/uploads/${filename}`);
      }

    async newProfilePic(imageUrl: string, client: UserDataDto) : Promise<number>
    {
        try {
            const nickname: string = client.nickname;
            // stocker image dans la db
            const storagedInDB: string | null = await this.databaseservice.updatePP(nickname, imageUrl);

            if (!storagedInDB)
                return (500);
            return (200);
        }
        catch (error) {
            console.log("Internal error:", error);
            return (500);
        }
    }

    async getUserInfo(target: string) : Promise<number | any>
    {
        try  {
            let success: any = await this.databaseservice.getUserInformation(target);
            if (!success)
                return (404);
            let userData: any = {};
            userData.nickname = success.username;
            userData.fullName = success.fullName;
            userData.imageUrl = success.pp;
            userData.id = success.id;
            userData.pseudo = success.pseudo;
            return (userData);
        }
        catch (error) {
            console.log("Error:", error);
            return (500);
        }
    }
}