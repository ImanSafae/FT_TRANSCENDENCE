import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class AuthDto
{
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class TwoFARequestDto
{
    // @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class TwoFAActivationDto
{
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    secret: string;

    userData: UserDataDto;
}

export class TwoFAVerifDto
{
    @IsNotEmpty()
    code: string;

    userData: UserDataDto;
}

export class UserDataDto 
{
    id: number;
    nickname: string;
    fullName: string;
    // campus: string;
    imageUrl: string;
    twoFA: boolean;
    blocklist: string[];
    pseudo: string;
}