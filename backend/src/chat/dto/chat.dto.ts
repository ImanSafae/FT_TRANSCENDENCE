import { UserDataDto } from "src/auth/dto";

export class RoomMessageDto
{
    roomName: string;
    message: string;
    userData: UserDataDto;
}

export class DirectMessageDto
{
    recipient: string;
    message: string; // changer ça en objet, qu'on définira d'ailleurs plus haut
    userData : UserDataDto;
}

export class RoomCreationDto
{
    roomName: string;
    password: string;
    privateStatus: boolean;
    userData: UserDataDto;
}

export class ProtectedRoomDto
{
    roomName: string;
    password: string;
    userData: UserDataDto;
}

export class RoomDto
{
    roomName: string;
    userData: UserDataDto;
}

export class AdminRequestsDto
{
    target: string;
    roomName: string;
    userData: UserDataDto;
}

export class InteractionDto
{
    target: string;
    userData: UserDataDto;
}