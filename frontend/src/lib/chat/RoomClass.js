export class Room {
    roomName = "";
    isProtected = false;
    isPrivate = false;
    owned = false;
    admined = false;
    accessGranted = false;
    users = [];
    messages = [];
    constructor(roomName, isPrivate, owned) {
        this.roomName = roomName;
        this.isPrivate = isPrivate;
        this.owned = owned;
        if (owned) {
            this.admined = true;
            this.accessGranted = true;
        }
    }
}
//# sourceMappingURL=RoomClass.js.map