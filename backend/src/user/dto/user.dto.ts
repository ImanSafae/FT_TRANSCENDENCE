
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

export class NicknameChangeDto
{
    userData: UserDataDto;
    newNickname: string;
}

export class InteractionDto
{
    target: string;
    userData: UserDataDto;
}