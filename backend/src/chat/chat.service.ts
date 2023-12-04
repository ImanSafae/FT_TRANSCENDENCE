import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { DatabaseService } from "src/database/database.service";

import { AdminRequestsDto, DirectMessageDto, InteractionDto, ProtectedRoomDto, RoomCreationDto, RoomDto, RoomMessageDto } from "./dto";
import { Server } from "http";
import { UserDataDto } from "src/auth/dto";
import { error } from "console";
import { stat } from "fs";

@Injectable({})
export class ChatService
{
    // *******************GET INFO****************** // 
    constructor(private databaseservice: DatabaseService) { }
    
    // async getUsersInRoom(data: RoomDto)
    // {
    //     try {
    //         const roomName: string = data.roomName;
    //         const client = data.userData.nickname;

    //         const allowed: boolean | number = await this.userInRoom(client, roomName);
    //         if (allowed === 404)
    //         {
    //             return (403);
    //         }

    //         // const usersInRoom = await this.databaseservice.getUserList
    //         // PAS FINI
    //     }
    //     catch (error) {
    //         console.log("Erreur interne:", error);
    //         return (500);
    //     }
    // }

    async getRoomStatus(roomName: string): Promise<number | boolean>
    {
        try {
            let roomInfo: any | null = await this.databaseservice.getRoomInformation(roomName);
            
            if (!roomInfo)
                return (404);

            let status: boolean = roomInfo.private;
            return (status);
        }
        catch (error) {
            console.log("Internal error", error);
            return (500);
        }
        
        return (false);
        // return (true); // FOR TEST PURPOSES ONLY !!!!!!!!!!!!!!!!!!!
    }
    
    async getMyRooms(userData: UserDataDto)
    {
        try {
            const client: string = userData.nickname;
            let myRooms: string[] | null = await this.databaseservice.getRoomJoined(client);
            if (myRooms === null)
                return (500);
            return (myRooms);
        }
        catch (error)
        {
            console.log("Internal error:", error);
            return (500);
        }
    }

    async userInRoom(client: string, roomName: string) : Promise<boolean | number>
    {
        try {
            // regarder dans la db si le user a cette room dans sa liste de rooms
            let allowed: boolean | null = await this.databaseservice.isJoinedRoom(client, roomName);
            if (allowed === null)
                return (404); // means user doesn't exist : shouldn't happen
            return (allowed);
        }
        catch (error)
        {
            console.log("Internal error:", error);
            return (500);
        }

    }
    
    async isUserBanned(target: string, roomName: string) : Promise<boolean>
    {
        let ban: boolean;
        // regarder dans la DB si target est dans la blacklist de roomName
        ban = await this.databaseservice.isBanFromRoom(roomName, target);
        // retourner true ou false
        return (ban);
    }
    
    isUserBlocked(client: string, target: string) : boolean
    {
        let block: boolean;
        // regarder dans la DB la blocklist de client, et si target y figure

        block = false; // test purposes only
        return (block);
    }
    
    async roomExists(roomName: string) : Promise<boolean>
    {
        try {
            let foundRoom: boolean;
            // regarder dans la dm si une room du nom de roomName existe
            
            let success = await this.databaseservice.roomExist(roomName)
            return (success);
        }
        catch (error) {
            console.log("Internal error", error);
            return (false);
        }
    }
    
    async isRoomProtected(roomName: string) : Promise<boolean>
    {
        try {
            let roomPwd: string;
            // regarder dans la db si roomName est protégée par un mdp
            roomPwd = await this.databaseservice.getPass(roomName);
            
            if (!roomPwd)
                return (false);
            // if (roomPwd === null)
            //     throw new Error("Room doesn't exist.");
            return (true);
        }
        catch (error)
        {
            console.log("Internal error:", error);
        }
    }

async verifyPassword(roomName: string, password: string) : Promise<boolean>
{
    let realPassword: string = await this.databaseservice.getPass(roomName);
    // Vérifier dans la DB si le password est correct
    // Si oui : renvoyer true
    // Sinon : renvoyer false
    if (realPassword === password)
        return (true);
    return (false);
}

async userExists(user: string) : Promise<boolean>
{
    try {
        let success: boolean = await this.databaseservice.UserExist(user);
        return (success);
    }
    catch(error) {
        console.log("Error:", error);
    }
}

// ********************ACTIONS*********************** //

async createRoom(socket: Socket, data: RoomCreationDto) : Promise<number>
{
    try {
        let owner: string = data.userData.nickname;
        let roomName: string = data.roomName;

        let roomExists: boolean = await this.databaseservice.roomExist(roomName);
        if (roomExists)
            return (400);

        // Ajouter nouvelle room dans la DB avec son password s'il y en a un
        let roomCreated: any = await this.databaseservice.createRoom(roomName, owner);
        if (data.password !== undefined && data.password !== "")
        {
            let password: string = data.password;
            await this.databaseservice.updateRoomPass(roomName, password);
        }

        // Ajouter cette room à la liste roomJoined et à la liste roomOwned du user
        let roomAddedToOwnedList: any = await this.databaseservice.addRoomToOwnedRoom(owner, roomName);
        let roomAddedToJoinedList: any = await this.databaseservice.addRoomToJoinedRoom(owner, roomName);
        if (!roomAddedToJoinedList || !roomAddedToOwnedList)
        {
            // ne devrait jamais se produire
            console.log("Erreur interne.");
            return (500);
        }
        return (200);
    }
    catch (error) {
        console.log("Erreur interne:", error);
        return (500);
    }
}

async joinRoom(socket: Socket, data: ProtectedRoomDto) : Promise<any | number> // pour l'instant on renvoie un bool mais plus tard ce sera un objet
{
    const client: string = data.userData.nickname;
    const roomName: string = data.roomName;
    const password: string = data.password;
    
    try {
        
        // Vérifier dans DB si roomName existe
        // Envoyer une erreur si elle n'existe pas
        if (!this.roomExists(roomName))
        {
            console.log("room", roomName, "doesn't exist");
            // erreur : cette room n'existe pas
            return (404);
            }
            
            // Vérifier si le user est banni de cette room ou pas
            // Envoyer une erreur s'il est bloqué
            let ban: boolean = await this.isUserBanned(client, roomName);
            if (ban)
            {
                // erreur : vous êtes banni de cette room
                return (403);
            }
            
            // Vérifier si elle est protégée par un MDP
            let protectedRoom: boolean = await this.isRoomProtected(roomName);
            // Si non : Ajouter le client à la liste des users dans cette room, et cette room à la liste des rooms dans lequel est le user
            // Envoyer que tout s'est bien passé avec l'accès à cette room + affichage des messages 
            // Si oui : vérifier si le mdp fourni est le bon
            if (protectedRoom === true)
            {
                let passwordVerified: boolean = await this.verifyPassword(roomName, password);
                // Si pas bon : envoyer erreur mauvais mdp
                if (!passwordVerified)
                    return (401);
            }
            // Si bon : même chose qu'au-dessus
            let userAdded = await this.databaseservice.addUserToRoom(roomName, client);
            let roomAdded = await this.databaseservice.addRoomToJoinedRoom(client, roomName);
            if (userAdded === null || roomAdded === null)
                return (500);
    
            return (true); 
        }
        catch (error)
        {
            console.log("Internal error:", error);
            return (500);
        }
    }

    async removeUser(data: AdminRequestsDto) : Promise<boolean>
    {
        const roomName: string = data.roomName;
        const target: string = data.target;

        const roomAdmin: boolean = await this.databaseservice.isRoomAdmin(roomName, target);
        if (roomAdmin)
        {
            const removedAsAdmin: string[] | null = await this.databaseservice.delUserFromAdminList(target, roomName);
            if (removedAsAdmin === null)
                return (false);
        }

        // enlever la room de la liste des rooms de ce user
        const removedFromJoinedRooms: string[] | null = await this.databaseservice.delRoomJoined(target, roomName);
        if (removedFromJoinedRooms === null)
            return (false);

        // enlever également le user de la liste des users dans cette room
        const removedFromUsers: string[] | null = await this.databaseservice.delUserFromUserList(target, roomName);
        if (removedFromJoinedRooms === null)
            return (false);

        return (true);
    }

    async leaveRoom(socket: Socket, data: RoomDto) : Promise<number>
    {
        const roomName = data.roomName;
        const client = data.userData.nickname;
        try {
            // suis-je owner de cette room ?
            // s'il est owner : l'enlever
            const roomOwned: boolean = await this.databaseservice.isRoomOwner(roomName, client);
            if (roomOwned)
            {
                const removedAsOwned: string[] | null = await this.databaseservice.delRoomOwned(client, roomName);
                if (removedAsOwned === null)
                    return (500);
            }

            // suis-je admin de cette room ?
            const roomAdmin: boolean = await this.databaseservice.isRoomAdmin(roomName, client);
            if (roomAdmin)
            {
                const removedAsAdmin: string[] | null = await this.databaseservice.delUserFromAdminList(client, roomName);
                if (removedAsAdmin === null)
                    return (500);
            }
            
            // enlever la room de la liste des rooms de ce user
            const removedFromJoinedRooms: string[] | null = await this.databaseservice.delRoomJoined(client, roomName);
            if (removedFromJoinedRooms === null)
                return (500);

            // enlever également le user de la liste des users dans cette room
            const removedFromUsers: string[] | null = await this.databaseservice.delUserFromUserList(client, roomName);
            if (removedFromJoinedRooms === null)
                return (500);

            return (200);
        }
        catch (error)
        {
            console.log("Internal error:", error);
            return (500);
        }
    }

    async banUser(data: AdminRequestsDto) : Promise<number>
    {
        const target: string = data.target;
        const client: string = data.userData.nickname;
        const roomName: string = data.roomName;

        // On regarde si le client est bien admin de la room
        const isAdmin: boolean | null = await this.databaseservice.isRoomAdmin(roomName, client);
        // false -> on renvoie un message d'erreur
        if (isAdmin === null)
            return (500); // should never happen
        else if (isAdmin === false)
            return (403) // user is not admin
        
        // true -> on enlève la target de cette room + on l'ajoute dans la banlist
        const removedUser: boolean = await this.removeUser(data);
        if (removedUser === false)
            return (500);
        const bannedUser = this.databaseservice.addUserToBanList(roomName, target);
        if (!bannedUser)
            return (500);
        return (200);
    }

    async kickUser(data: AdminRequestsDto) : Promise<number>
    {
        const target: string = data.target;
        const client: string = data.userData.nickname;
        const roomName: string = data.roomName;

        // On regarde si le client est bien admin de la room
        const isRoomAdmin: boolean | null = await this.databaseservice.isRoomAdmin(roomName, client);
        if (isRoomAdmin === null)
            return (500);
        // false -> on renvoie un message d'erreur
        else if (isRoomAdmin === false)
            return (403);
        // true -> on enlève la target de cette room
        const success: boolean = await this.removeUser(data);
        if (!success)
            return (500);
        return (200);
    }

    // async muteUser(data: AdminRequestsDto) : Promise<number>
    // {
    //     const target: string = data.target;
    //     const client: string = data.userData.nickname;
    //     const roomName: string = data.roomName;

    //     // On regarde si le client est bien admin de la room
    //     const isRoomAdmin: boolean | null = await this.databaseservice.isRoomAdmin(roomName, client);
    //     if (isRoomAdmin === null)
    //         return (500);
    //     // false -> on renvoie un message d'erreur
    //     else if (isRoomAdmin === false)
    //         return (403);
    //     // true -> on ajoute la target à la muteList
    //     const success = await this.databaseservice.addUserToMuteList(roomName, target);
    //     if (success === null)
    //         return (500);
    //     else if (success === false)
    //         return (400);
    //     return (200);
    // }

    async giveAdminRights(data: AdminRequestsDto) : Promise<number>
    {
        const target: string = data.target;
        const client: string = data.userData.nickname;
        const roomName: string = data.roomName;

        // On regarde si le client est bien admin de la room
        const isRoomOwner: boolean | null = await this.databaseservice.isRoomOwner(roomName, client);
        if (isRoomOwner === null)
            return (500);
        // false -> on renvoie un message d'erreur
        else if (isRoomOwner === false)
            return (403);
        // true -> on ajoute data.target comme admin de data.roomName
        const success = await this.databaseservice.addUserToAdminList(roomName, target);
        if (success === null)
            return (500);
        else if (success === false)
            return (400);
        return (200);
    }

    async changeRoomPassword(data: ProtectedRoomDto)
    {
        try {

            const client: string = data.userData.nickname;
            const newPwd: string = data.password;
            const roomName: string = data.roomName;
            
            // On regarde si le client est bien owner de la room
            const isRoomOwner: boolean | null = await this.databaseservice.isRoomOwner(roomName, client);
            if (isRoomOwner === null)
                return (500);
            // false -> on renvoie un message d'erreur
                else if (isRoomOwner === false)
            return (403);
        // true -> on change le mdp de data.roomName dans la db
        let success: string | null = await this.databaseservice.updateRoomPass(roomName, newPwd);
            if (!success)
                return (500);
            return (200); // test purposes only
        }
        catch (error)
        {
            console.log("Internal error:", error);
            return (500);
        }
    }

    async deletePassword(data: ProtectedRoomDto)
    {
        try {

            const client: string = data.userData.nickname;
            const roomName: string = data.roomName;
            
            // On regarde si le client est bien owner de la room
            const isRoomOwner: boolean | null = await this.databaseservice.isRoomOwner(roomName, client);
            if (isRoomOwner === null)
                return (500);
            // false -> on renvoie un message d'erreur
            else if (isRoomOwner === false)
                return (403);
            // true -> on change le mdp de data.roomName dans la db
            let success: string | null = await this.databaseservice.updateRoomPass(roomName, null);
            if (!success)
                return (500);
            return (200); // test purposes only
        }
        catch (error)
        {
            console.log("Internal error:", error);
            return (500);
        }
    }

    async toggleRoomPrivate(data: RoomDto) : Promise<number>
    {
        try {

            const client: string = data.userData.nickname;
            const roomName: string = data.roomName;
            
            // On regarde si le client est bien admin de la room
            const isRoomAdmin: boolean | null = await this.databaseservice.isRoomAdmin(roomName, client);
            if (isRoomAdmin === null)
                return (500);
            // false -> on renvoie un message d'erreur
            else if (isRoomAdmin === false)
                return (403);
        
            // true -> on switch la room en privé (ou en public) dans la db
            let success = await this.databaseservice.switchRoomPrivate(roomName);
            return (200); // test purposes only
        }
        catch (error)
        {
            console.log("Internal error:", error);
            return (500);
        }
    }

    async displayRoom(data: RoomDto) : Promise<any | number>
    {
        try {
            // checker que la room existe
            let roomExists: boolean = await this.databaseservice.roomExist(data.roomName);
            // sinon -> renvoyer 404
            if (!roomExists)
                return (404);
            
            // checker que le user est bien dans la room
            let userInRoom: boolean | null = await this.databaseservice.isRoomUser(data.roomName, data.userData.nickname);
            if (userInRoom === null)
                return (500); // should never happen because room exists
            // sinon -> renvoyer 403
            if (userInRoom === false)
                return (403); 
            
            // renvoyer les infos
            let roomContent: any = await this.databaseservice.getRoomInformation(data.roomName);
            if (!roomContent)
                return (500); // should never happen bc room exists
            
            let protectedRoom: boolean = false;
            if (roomContent.password && roomContent.password !== "")
                protectedRoom = true;

            let roomData: any = {
                adminList: roomContent.adminList,
                id: roomContent.id,
                messages: roomContent.messages,
                name: roomContent.name,
                owner: roomContent.owner,
                protected: protectedRoom,
                private: roomContent.private,
                userList: roomContent.userList
            };
            // console.log("data from db:", roomContent);
            return (roomData);
        }
        catch (error)
        {
            console.log("Internal error:", error);
            return (500);
        }
    }

    async blockUser(blockData: InteractionDto)
    {
        const target: string = blockData.target;
        const client: string = blockData.userData.nickname;

        let success: string[] | boolean | null = await this.databaseservice.addBlockedUser(client, target);

        if (success === null) // means user not in db -> should never happen
            return (500);
        if (success === false) // means target was already blocked
            return (400);
        return (200);
    }

    async unblockUser(blockData: InteractionDto)
    {
        const target: string = blockData.target;
        const client: string = blockData.userData.nickname;

        let success: string[] | null = await this.databaseservice.delBlockedUser(client, target);

        if (success === null) // means user not in db -> should never happen
            return (500);
        // console.log("Here is the updated blocklist of", client, ":", success);
        return (200);
    }

    async sendFriendRequest(data: InteractionDto)
    {
        try {
            const target: string = data.target;
            const client: string = data.userData.nickname;
            
            console.log(client, "is sending a friend request to", target);
            
            let success: string[] | boolean | null = await this.databaseservice.addFriendRequest(target, client);
            // ajouter dans le tableau des requêtes
            
            if (success === null) // means user not in db -> should never happen
                return (404);
            if (success === false) // request already sent
            {
                console.log("Already requested");
                return (400);
            }
            console.log("State of the current friend requests:", success);
            return (200);
        }
        catch (error) {
            console.log("Error:", error);
            return (500);
        }
    }

    // async getFriendsList(data: UserDataDto) : Promise<Map<string, string> | number>
    // {
    //     try {
    //         let client: string = data.nickname;
            
    //         let success: string[] | null = await this.databaseservice.getFriendListByUser(client);
    //         if (success === null)
    //             return (500);

    //         console.log("retrieved friend list from db:", success);
    //         let friendsStatus: Map<string, string> = new Map<string, string>();
    //         success.forEach(async (friend) => {
    //             let status = await this.databaseservice.getStatusByUser(friend);
    //             if (status === null)
    //             { 
    //                 console.log("User not found while retrieving status.");
    //                 throw (error);
    //             }
    //             friendsStatus.set(friend, status);
    //             console.log(friend, "is", status);
    //         });
    //         console.log("Returned map:", friendsStatus);
    //         return (friendsStatus);
    //     }
    //     catch (err)
    //     {
    //         console.log("Internal error:", err);
    //         return (500);
    //     }
    // }

    async getFriendsList(data: UserDataDto): Promise<Map<string, string> | number> {
        try {
            let client: string = data.nickname;
            
            let success: string[] | null = await this.databaseservice.getFriendListByUser(client);
            if (success === null) {
                return 500;
            }
    
            console.log("retrieved friend list from db:", success);
            const friendsStatus: Map<string, string> = new Map<string, string>();
    
            const promises = success.map(async (friend) => {
                const status = await this.databaseservice.getStatusByUser(friend);
                if (status === null) {
                    // console.log("User not found while retrieving status.");
                    throw new Error("User not found while retrieving status.");
                }
                friendsStatus.set(friend, status);
            });
    
            await Promise.all(promises);
    
            // console.log("Returned map:", friendsStatus);
            return friendsStatus;
        } catch (err) {
            console.log("Internal error:", err);
            return 500;
        }
    }

    async getPublicRooms()
    {
        try {
            let publicRooms: any | null = await this.databaseservice.getPublicRooms();
            if (publicRooms === null)
                return (500);
            return (publicRooms);
        }
        catch (error) {
            console.log("Internal error:", error);
            return (500);
        }
    }

    
    async acceptRequest(data: InteractionDto) : Promise<number>
    {
        try {
            const target: string = data.target;
            const client: string = data.userData.nickname;
            
            let success: string[] | boolean | null = await this.databaseservice.addFriend(client, target);
            let success2: string[] | boolean | null = await this.databaseservice.addFriend(target, client);
            
            // Supprimer target de la liste de demandes d'amis de client
            let success3: string[] | null = await this.databaseservice.delFriendRequest(client, target);
            
            if (success === null || success2 === null || success3 === null) // means user not in db -> should never happen
                return (500);
            if (success === false || success2 === false) // means target was already a friend
                return (400);
            console.log("Request successfully accepted");
            console.log(client, "'s current friend list:", success);
            console.log(target, "'s current friend list:", success2);
            console.log(client, "'s current friend requests list:", success3);
            return (200);
        }
        catch (error) {
            console.log("Error:", error);
            return (500);
        }
    }
    
    async declineRequest(data: InteractionDto)
    {
        const target: string = data.target;
        const client: string = data.userData.nickname;
        
        let success: string[] | null = await this.databaseservice.delFriendRequest(client, target);
        if (success === null) // user not found ; shouldn't happen
        return (404);
        return (200);
    }
    
    async newMessageInRoom(data: RoomMessageDto)
    {
        try {
            const sender: string = data.userData.nickname;
            const roomName: string = data.roomName;
            const message: string = data.message;
            
            // Vérifier que le user est dans la room
            let userInRoom: boolean | number = await this.userInRoom(sender, roomName);
            if (userInRoom === 404 || userInRoom === 500)
            {
                return (500);
            }
            if (userInRoom === false)
            return (401);
        
        let success: any | null = await this.databaseservice.saveRoomMessage(sender, roomName, message);
        if (!success)
            return (404);
        return (200);
        }
        catch(error) {
            console.log("Internal error:", error);
            console.log("Returning 500");
            return (500);
        }
    }

    async getUserStatus(user: string) : Promise<string | number>
    {
        try  {
            const status: string | null = await this.databaseservice.getStatusByUser(user);
            if (status === null)
                throw (new Error("User not found"));
            return (status);
        }
        catch (error) {
            return (500);
        }
    }

    async newDm(data: InteractionDto)
    {
        const target: string = data.target;
        const nickname: string = data.userData.nickname;

        // checker si le user existe
        let userExists: boolean = await this.databaseservice.UserExist(target);
        if (!userExists)
            return (404);

        // checker si ces 2 users n'ont pas déjà une conversation
        // let getDm: any = await this.databaseservice.getDm(nickname, target);
        // if (getDm)
            // return (400);

        // créer une nouvelle entrée de dm
    }

    async sendPrivateMessage(data: DirectMessageDto)
    {
        const recipient: string = data.recipient;
        const client: string = data.userData.nickname;
        const message = data.message;

        let success: any | null = await this.databaseservice.savePrivateMessage(client, recipient, message);
        // console.log("successfully saved DM from", client, "to", recipient, "?:", success);
        if (success === null)
        return (404);
        console.log("This is the message being sent:", success);
        return (success);
    }

    async getDms(data: InteractionDto)
    {
        try {
            const client: string = data.userData.nickname;
            const target: string = data.target;
            
            const success: any[] = await this.databaseservice.getUsersConversation(client, target);
            return (success);
        }
        catch (error) {
            console.log("Error:", error);
            return (500);
        }
    }

    async getPrivateConvosList(data: UserDataDto)
    {
        try {
            const client: string = data.nickname;

            let messagesSent: any[] = await this.databaseservice.getMessagesSent(client);
            let messagesReceived: any[] = await this.databaseservice.getMessagesReceived(client);
           
            let conversations: string[] = [];
            
            messagesSent.forEach((dm) => {
                let interlocutor: string;
                client === dm.sender.username ? interlocutor = dm.receiver.username : interlocutor = dm.sender.username;
                if (conversations.includes(interlocutor))
                    return ;
                conversations.push(interlocutor);
            });
            messagesReceived.forEach((dm) => {
                let interlocutor: string;
                client === dm.sender.username ? interlocutor = dm.receiver.username : interlocutor = dm.sender.username;
                if (conversations.includes(interlocutor))
                    return ;
                conversations.push(interlocutor);
            });
            return (conversations);
        }
        catch(error) {
            console.log("Error:", error);
            return (500);
        }
    }

    async getFriendRequests(client: string)
    {
        try {
            let success: string[] | null = await this.databaseservice.getFriendRequest(client);

            if (success === null)
            {
                console.log("User not found");
                return (404); // should never happen
            }
            // console.log("Current state of", client, "'s current requests:", success);
            return (success);
        }
        catch (error) {
            console.log("Error:", error);
            return (500);
        }
    }

    async checkFriendship(data: InteractionDto)
    {
        try {
            const client: string = data.userData.nickname;
            const target: string = data.target;

            const success: boolean | null = await this.databaseservice.isFriend(client, target);

            if (success === null)
                return (404); // should never happen

            return (success);
        }
        catch (error) {
            console.log("Error:", error);
        }
    }

    async getGameHistory(target: string)
    {
        try {
            let success = await this.databaseservice.getScoresForUser(target);
            return (success);
        }
        catch (error) {
            console.log("Error:", error);
            return (500);
        }
    }
}