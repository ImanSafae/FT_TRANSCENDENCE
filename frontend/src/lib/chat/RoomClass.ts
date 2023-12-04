export class Room
{
    roomName: string = "";

    isProtected: boolean = false;
    isPrivate: boolean = false;

    owned: boolean = false;
    admined: boolean = false;
    accessGranted: boolean = false;

    users: any[] = [];
    messages: any[] = [];

    constructor(roomName: string, isPrivate: boolean, owned: boolean)
    {
        this.roomName = roomName;
        this.isPrivate = isPrivate;
        this.owned = owned;

        if (owned)
        {
            this.admined = true;
            this.accessGranted = true;
        }
    }
}