import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { toDataURL } from 'qrcode';
import { TwoFAActivationDto, TwoFAVerifDto, UserDataDto } from './dto';

import { DatabaseService } from 'src/database/database.service';


//todo secret has to be in .env
const uid:string = "u-s4t2ud-0c5d0153eee0509ce923228ecef6e8ebb0cfb2e2fe4ab50b6bdc528d6a86dd21";
const secret:string = "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";
// /!\ LE SECRET EXPIRE ET DOIT ETRE RENOUVELE REGULIEREMENT VIA L'INTRA SINON L'AUTHENTIFICATION NE MARCHE PLUS

const apiUrl:string = "https://api.intra.42.fr";
const tokenEndpoint:string = "/oauth/token";
const userDataEndpoint:string = "/v2/me";
const redirectUri =  "http://159.65.54.159:5173/";

@Injectable({})
export class AuthService
{

    constructor(private databaseservice: DatabaseService) { }

    async getToken(code: string)
    {   
        let accessToken:string; 
        console.log("code received:", code);
        let params = {
            "grant_type":"authorization_code",
            "client_id":uid,
            "client_secret":secret,
            "code":code,
            "redirect_uri":redirectUri
        };
        
        const response = await fetch(apiUrl + tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });
        
        const data = await response.json();
        accessToken = data.access_token;
        // console.log("Access token is:", accessToken);
        return(accessToken);
    }

    async storageUserData(data: any)
    {
        try {
            await this.databaseservice.createUser(data.nickname, data.imageUrl, data.fullName, data.id);
        }
        catch (error) {
            // Renvoyer au front une erreur pour lui dire de se déconnecter et réessayer
        }
    }

    async tradeCodeForData(code: string)
    {
        try
        {
            let accessToken = await this.getToken(code);
            let data = await fetch(apiUrl+userDataEndpoint, {
                method:"GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`                    
                    }
                });
            if (data.ok)
            {
                let newData = await data.json();
                let login: string = newData.login;
                let userExists: boolean = await this.databaseservice.UserExist(login);
                if (!userExists) // PREMIERE CONNEXION
                {
                    let myData = {
                        "fullName":newData.usual_full_name, 
                        "nickname":newData.login,
                        // "campus":newData.campus[0].name,
                        "imageUrl":newData.image.versions.small,
                        "id":newData.id,
                        "twoFA": false,
                        "blocklist":[],
                        "pseudo":newData.login
                    };
                    console.log("storing data about this user for the first time:", myData);
                    await this.storageUserData(myData);
                    let userData = await this.getUserData(login);
                    let newlyCreatedData = {
                            "fullName":userData.fullName, 
                            "nickname":userData.username,
                            "imageUrl":userData.pp,
                            "id":userData.id,
                            "twoFA": userData.FA2,
                            "blocklist":userData.blockedUser,
                            "pseudo":userData.pseudo
                        };
                    // console.log("user is in db, sending back his storaged info:", newlyCreatedData);
                       return (newlyCreatedData);
                }
                else { // PAS LA PREMIERE CONNEXION
                    // console.log("user is already in db");
                    let active2FA: boolean = await this.databaseservice.getFA2ByUser(newData.login);
                    if (active2FA)
                        return ({
                            fullName: undefined,
                            nickname:newData.login,
                            imageUrl: undefined,
                            id: undefined,
                            twoFA:true,
                            blocklist: undefined,
                            pseudo: undefined
                        });
                    else // user existe déjà dans la db et n'a pas activé la 2FA -> on renvoie ses infos existantes
                    {
                        let userData = await this.getUserData(login);
                        let myData = {
                            "fullName":userData.fullName, 
                            "nickname":userData.username,
                            "imageUrl":userData.pp,
                            "id":userData.id,
                            "twoFA": userData.FA2,
                            "blocklist":userData.blockedUser,
                            "pseudo":userData.pseudo
                        };
                        // console.log("user is in db, sending back his storaged info:", myData);
                        return (myData);
                    }
                }
            }
        }
        catch (err)
        {
            console.log("Error: ", err);
        }
    }

    async getUserData(login: string)
    {
        try {
            let userData: any = await this.databaseservice.getUserInformation(login);
            return (userData);
        }
        catch (error) {
            console.log("Error:", error);
            return (null);
        }
    }

    generateSecretAndUri(userEmail: string)
    {
        const secret = authenticator.generateSecret();
        // clé secrète propre à chaque user qui permet de générer des codes en fonction de la date et de l'heure

        const  keyUri = authenticator.keyuri(userEmail, "JIMF's TRANSCENDENCE", secret);
        /* génère l'uri qui permettra de générer le qr code et passer à Google Authenticator notre secret
        et lui permettre de générer un code */

        return ({secret, keyUri}); 
    }

    async generateQrCode(keyUri: string): Promise<string> {
        const codeQR = await toDataURL(keyUri);
        return codeQR;
    }
    

    async activate2FA(userEmail: string) {
        const { secret, keyUri } = this.generateSecretAndUri(userEmail);
        const codeQR = await this.generateQrCode(keyUri);
        // console.log("codeQR: ", codeQR);
    
        return { secret, codeQR };
    }

    isTwoFACodeValid(token: string, secret: string)
    {
        let isValid: boolean = authenticator.verify({token, secret});

        return (isValid);
    }

    async confirm2FAActivation(data: TwoFAActivationDto) : Promise<boolean | null>
    {
        let code: string = data.code;
        let secret: string = data.secret;
        let userData = data.userData;
        if (this.isTwoFACodeValid(code, secret))
        {
            try {
                let nickname: string = userData.nickname;
                let success2 = await this.databaseservice.switchFA2(nickname);
                let success: string = await this.databaseservice.updateFA2Key(nickname, secret);
                if (!success || !success2) // -> erreur car le user n'existe pas ; ne devrait jamais arriver
                {
                    // console.log("DB error... this should never happen");
                    return (null);
                }
                return (true);
            }
            catch (error)
            {
                console.log("Internal error.");
                // Dire à l'utilisateur de réessayer plus tard : erreur interne.
            }
        }
        return (false);
    }

    async deactivate2FA(data: UserDataDto) : Promise<boolean>
    {
        try {
            let twoFaStatus: boolean = await this.databaseservice.getFA2ByUser(data.nickname);
            if (twoFaStatus === true)
            {
                let success: boolean = await this.databaseservice.switchFA2(data.nickname);
                if (success !== false)
                {
                    throw new Error("Erreur : impossible de modifier FA2.");
                }
            }
            return (twoFaStatus);
        }
        catch (error) {
            console.log("erreur interne : demander à l'utilisateur de réessayer plus tard");
        }
    }

    async verif2FACodeUponLogin(data: TwoFAVerifDto) : Promise<boolean | any>
    {
        try {
            // Récupérer le secret dans la DB à l'aide de l'id fourni
            let nickname: string = data.userData.nickname;
            let secret: string = await this.databaseservice.getFA2KeyByUser(nickname);
            console.log(nickname,"'s secret is:", secret);
            let userExists: boolean = await this.databaseservice.UserExist(nickname);
            console.log("does user exist in db?", userExists);
            
            // Vérifier, avec le secret, que le code fourni est ok
            let validCode: boolean = this.isTwoFACodeValid(data.code, secret);
            console.log("From the service: code is verified:", validCode);

            // Retourner FALSE si le code n'est pas bon, userData s'il est bon
            if (!validCode)
                return (validCode);
            else
            {
                try {
                    let userData: any = await this.databaseservice.getUserInformation(data.userData.nickname);
                    let dataToReturn: UserDataDto = {
                        id: userData.id42,
                        nickname:userData.username,
                        fullName:userData.fullName,
                        imageUrl:userData.pp,
                        twoFA: true,
                        blocklist: userData.blockedUser,
                        pseudo: userData.pseudo
                    };
                    return (dataToReturn);
                }
                catch (error) {
                    console.log("Internal error:", error);
                }
            }
        }
        catch (error)
        {
            console.log("Internal error:", error);
        }
    }

    async logOut(data: UserDataDto) : Promise<boolean>
    {
        let success: string | null = await this.databaseservice.updateStatus(data.nickname, "offline");
        if (success)
            return (true);
        return (false);
        // return (true) // en attendant de fix le pb de updatestatus
    }
}
