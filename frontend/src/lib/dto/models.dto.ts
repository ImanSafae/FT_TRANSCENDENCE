export interface UserDataDto {
    id: number;
    nickname: string;
    fullName: string;
    // campus: string;
    imageUrl: string;
    twoFA: boolean,
    blocklist: string[],
    pseudo: string
}

export interface MessageDto
{
    user: string;
    message: string;
}

