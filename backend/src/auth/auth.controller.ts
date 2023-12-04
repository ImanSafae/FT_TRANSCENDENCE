import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, TwoFARequestDto, TwoFAActivationDto, TwoFAVerifDto, UserDataDto } from './dto';

import { DatabaseService } from 'src/database/database.service';

@Controller('auth')
export class AuthController
{
    constructor(private authservice: AuthService, private databaseservice: DatabaseService) {}

    @Post('code')
    async tradeCodeForData(@Body() dto: AuthDto) : Promise<any | boolean>
    {
        try
        {
            let data: any | boolean = await this.authservice.tradeCodeForData(dto.code);
            return (data);
        }
        catch (error)
        {
            console.error("Une erreur s'est produite:", error);
            return { message: 'Une erreur s\'est produite' };
        }
    }

    @Post('2fa/getqrcode')
    async activate2FA(@Body() userEmail: TwoFARequestDto)
    {
        // Etape 1 : générer un secret + un QR code
        // console.log("email is: ", userEmail.email);
        let {secret, codeQR} = await this.authservice.activate2FA(userEmail.email);

         // Etape 2 : les envoyer et attendre un code
        return ({secret, codeQR});

    }
    
    @Post('2fa/activate') // 1ere activaction de la 2FA
    async confirmActivation(@Body() data: TwoFAActivationDto)
    {
        try
        {
            let success: boolean = await this.authservice.confirm2FAActivation(data);
            return (success);
        }
        catch (error)
        {
            console.log("Erreur interne à l'activation de la 2fa.")
            // erreur interne: dire à l'utilisateur de réessayer.
        }
    }

    @Post("2fa/deactivate")
    async deactivate2FA(@Body() data: UserDataDto)
    {
        try {
            let success: boolean = await this.authservice.deactivate2FA(data);
            return (success);
        }
        catch (error) {
            console.log("Internal error:", error);
            // ask user to try again later
        }
    }

    @Post('2fa/verifcode')
    async verifyTwoFaCode(@Body() data: TwoFAVerifDto)
    {
        try {
            let validCode: boolean | UserDataDto = await this.authservice.verif2FACodeUponLogin(data);
            // console.log("Code verified:", validCode);
            return (validCode); // plutôt renvoyer la data si le code est valide !!!
        }
        catch (error)
        {
            // Erreur interne, try again later.
        }
    }

    @Post("logout")
    async logOut(@Body() data: UserDataDto)
    {
        try {
            return this.authservice.logOut(data);
        }
        catch (error)
        {
            console.log("Internal error:", error);
            return (false);
        }
    }
}
