import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { DirectMessageDto, ProtectedRoomDto, RoomDto, RoomMessageDto, AdminRequestsDto, RoomCreationDto, InteractionDto } from "./dto";
import { ChatService } from "./chat.service";
import { DatabaseService } from "src/database/database.service";
import { UserDataDto } from "src/auth/dto";
import { Get } from "@nestjs/common";

@WebSocketGateway({ cors: {
    origin: "*"}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect
{

    @WebSocketServer()
    server: Server;
    connectedClients: Map<string, Socket> = new Map;

    constructor(private chatservice: ChatService, private databaseservice: DatabaseService) {}

    private getSocketByUser(nickname: string) : Socket
    {
        // if (this.connectedClients.has(nickname))
        // {
        //     console.log("Found socket of user", nickname);
        //     return (this.connectedClients[nickname]);
        // }
        for (const [clientNick, clientSocket] of this.connectedClients.entries()) {
            if (clientNick === nickname) {
                return clientSocket;
            }
        }
        console.log("no such user in map");
        return (null);
    }

    @SubscribeMessage("updateNickname")
    updateNickname(oldNickname: UserDataDto, newNickname: string)
    {
    // Supprimez l'ancien nickname du Map
    const oldSocketId = this.connectedClients.get(oldNickname.nickname);
    this.connectedClients.delete(oldNickname.nickname);

    // Ajoutez le nouveau nickname au Map
    this.connectedClients.set(newNickname, oldSocketId);
    }

    handleConnection(client: Socket) {
        try {
            const clientNick = client.handshake.auth.username;
            console.log("new connectionnnn from ", clientNick, "of id ", client.id);
            if (this.connectedClients.has(clientNick))
            {
                this.connectedClients.set(clientNick, client);
                return ;
            }
            this.connectedClients.set(clientNick, client);
            this.databaseservice.updateStatus(clientNick, "online");
        }
        catch (error) {
            console.log("Internal error", error);
        }
    }

    handleDisconnect(client: Socket) {
        try {
            const clientNick = client.handshake.auth.username;
            this.connectedClients.delete(clientNick);
            this.databaseservice.updateStatus(clientNick, "offline");
        }
        catch (error) {
            console.log("Internal error", error);
        }
    }

    @SubscribeMessage("createRoom")
    async handleCreateRoom(socket: Socket, data: RoomCreationDto)
    {
        try
        {
            let success: number = await this.chatservice.createRoom(socket, data);
            console.log("Attempting to create room", data.roomName);
            if (success === 500)
            {
                socket.emit("Internal error");
                return ;
            }
            else if (success === 400)
            {
                socket.emit("room already exists");
                return ;
            }
            console.log("socket number " + socket.id + " just joined room " + data.roomName);
            socket.emit("room creation success");
        }
        catch(error)
        {
            console.log("Internal error", error);
            socket.emit("Internal error");
        }
        // --------------> PAS FINI !!!!!!!!!!!!!!!!!! <--------------

    }

    @SubscribeMessage("joinRoom")
    async handleJoinRoom(socket: Socket, data: ProtectedRoomDto)
    {
        // cette fonction ne renvoie pas le contenu de la room, elle donne seulement au user les permissions d'accéder
        // à cette room 
        try {
            const roomContent = await this.chatservice.joinRoom(socket, data);
            if (roomContent === 404)
            {
                socket.emit("room not found");
                return ;
            }
            else if (roomContent === 401)
            {
                socket.emit("wrong password");
                return ;
            }
            else if (roomContent === 403)
            {
                socket.emit("banned from room");
                return ;
            }
            else if (roomContent === 500)
            {
                console.log("Internal error, content not found");
                socket.emit("Internal error");
                return ;
            }
            if (roomContent)
            {
                socket.join(data.roomName);
                socket.to(data.roomName).emit("new connection", data.userData.nickname + " just joined the room!");
                socket.emit("Join success");
                this.server.to(data.roomName).emit("new user", data.userData.nickname);
            }
        }
        catch (error)
        {
            console.log("Internal error:",error);
            socket.emit("Internal error");
        }
    }

    @SubscribeMessage("leaveroom")
    handleLeaveRoom(socket: Socket, data: RoomDto)
    {
        try {
            this.chatservice.leaveRoom(socket, data);
            return (true); // tout s'est bien passé
        }
        catch (error)
        {
            return (false); // problème qlq part
        }
    }

    
    @SubscribeMessage("banUser")
    async banUser(socket: Socket, data: AdminRequestsDto)
    {
        try {
            
            const bannedUser: number = await this.chatservice.banUser(data);
            if (bannedUser === 403)
            {
                socket.emit("not allowed");
                return ;
            }
            else if (bannedUser === 500)
            {
                socket.emit("Internal error");
                return ;
            }
            
            const socketToBan = this.getSocketByUser(data.target);
            if (socketToBan)
            {
                socketToBan.leave(data.roomName);
                socket.emit("leave room");
            }
        }
        catch (error) {
            console.log("Internal error:", error);
        }
    }
    
    @SubscribeMessage("kickUser")
    async kickUser(socket: Socket, data: AdminRequestsDto)
    {
        // MEME CHOSE QUE BANUSER MAIS SANS AJOUTER A LA BANLIST
        
        try {
            const kickedUser: number = await this.chatservice.kickUser(data);
            if (kickedUser === 403)
            {
                socket.emit("not allowed");
                return ;
            }
            else if (kickedUser === 500)
            {
                socket.emit("Internal error");
                return ;
            }
            
            const socketToKick = this.getSocketByUser(data.target);
            if (socketToKick)
            {
                socketToKick.leave(data.roomName);
                socket.emit("leave room");
            }
        }
        catch (error) {
            console.log("Internal error:", error);
        }
    }
    
    // @SubscribeMessage("muteUser")
    // async muteUser(socket: Socket, data: AdminRequestsDto)
    // {
    //     // trouver un moyen de récupérer le socket et de l'empêcher de parler pendant x temps
    //     // ajouter dans la fonction sendMesasge, une étape de vérification de la mutelist
        
    //     try {
    //         const mutedUser: number = await this.chatservice.muteUser(data);
    //         if (mutedUser === 403)
    //         {
    //             socket.emit("not allowed");
    //             return ;
    //         }
    //         else if (mutedUser === 500)
    //         {
    //             socket.emit("Internal error");
    //             return ;
    //         }
    //         else if (mutedUser === 400)
    //         {
    //             socket.emit("bad request", "User is already muted.");
    //         }
    //     }
    //     catch (error) {
    //         console.log("Internal error:", error);
    //     }
    // }
    
    @SubscribeMessage("giveAdminRights")
    async giveAdminRights(socket: Socket, data: AdminRequestsDto)
    {
        try {
            const success: number = await this.chatservice.giveAdminRights(data);
            
            if (success === 500)
            {
                socket.emit("Internal error");
                return ;
            }
            else if (success === 400)
            {
                socket.emit("bad request", "User is already admin.");
                return ;
            }
            else if (success === 403)
            {
                socket.emit("not allowed");
                return ;
            }

            const targetSocket: Socket = this.getSocketByUser(data.target);
            if (targetSocket)
            {
                targetSocket.emit("get admin rights");
            }
            }
        catch (error)
        {
            // Le user n'a pas le droit de changer le mdp : requête frauduleuse -> envoyer une erreur.
            socket.emit("Internal error");
        }
    }

    @SubscribeMessage("newRoomPassword")
    async changeRoomPassword(socket: Socket, data: ProtectedRoomDto)
    {
        try {
            let success: number = await this.chatservice.changeRoomPassword(data);
            if (success === 500)
            {
                socket.emit("Internal error");
                return ;
            }
            else if (success === 403)
            {
                socket.emit("not allowed");
                return ;
            };
            socket.to(socket.id).emit("password change");
        }
        catch (error)
        {
            console.log("Internal error", error);
            socket.emit("Internal error");
        }
    }

    @SubscribeMessage("deletePassword")
    async deletePassword(socket: Socket, data: ProtectedRoomDto)
    {
        try
        {
            let success: number = await this.chatservice.deletePassword(data);
            if (success === 500)
            {
                socket.emit("Internal error");
                return ;
            }
            else if (success === 403)
            {
                socket.emit("not allowed");
                return ;
            }
            socket.to(socket.id).emit("password change");
        }
        catch (error)
        {
            console.log("Internal error", error);
            socket.emit("Internal error");
        }
    }
    
    @SubscribeMessage("toggleRoomPrivate")
    async toggleRoomPrivate(socket: Socket, data: RoomDto)
    {
        try
        {
            let success: number = await this.chatservice.toggleRoomPrivate(data);
            if (success === 500)
            {
                socket.emit("Internal error");
                return ;
            }
            else if (success === 403)
            {
                socket.emit("not allowed");
                return ;
            }
            socket.to(data.roomName).emit("toggle room private");
        }
        catch (error) {
            console.log("Internal error", error);
            socket.emit("Internal error");
        }
    }

    @SubscribeMessage("displayRoom")
    async displayRoom(socket: Socket, data: RoomDto)
    {
        // console.log("request from user", data.userData.nickname, "to see room", data.roomName);
        let roomContent: any | number = await this.chatservice.displayRoom(data);
        if (roomContent === 500)
        {
            socket.emit("Internal error");
            return ;
        }
        else if (roomContent === 403)
        {
            console.log("not allowed to see room content");
            socket.emit("not allowed");
            return ;
        }
        else if (roomContent === 404)
        {
            console.log("room doesn't exist");
            socket.emit("room not found");
            return ;
        }
        socket.emit("room content", roomContent);
    }
    
    @SubscribeMessage("getMyRooms")
    async getMyRooms(socket: Socket, userData: UserDataDto)
    {
        let myRooms: string[] | number = await this.chatservice.getMyRooms(userData);
        if (myRooms === 500)
        {
            socket.emit("Internal error");
            return ;
        }
        socket.emit("rooms list", myRooms);
    }
    
    @SubscribeMessage("block")
    async blockUser(socket: Socket, blockData: InteractionDto)
    {
        // console.log(blockData.userData.nickname, "is attempting to block", blockData.target);
        const success: number = await this.chatservice.blockUser(blockData);
        if (success === 500)
            socket.emit("Internal error");
        else if (success === 400) {
            socket.emit("already blocked");
            console.log("this user is already blocked");
        }
        else {
            socket.emit("successfully blocked", blockData.target);
            // console.log("success!");
        }
    }

    @SubscribeMessage("unblock")
    async unblockUser(socket: Socket, blockData: InteractionDto)
    {
        // console.log(blockData.userData.nickname, "is attempting to unblock", blockData.target);
        const success: number = await this.chatservice.unblockUser(blockData);
        if (success === 500)
            socket.emit("Internal error");
        // else if (success === 400) {
        //     socket.emit("user wasn't blocked");
        //     console.log("user wasn't blocked");
        // }
        else {
            socket.emit("successfully unblocked", blockData.target);
            // console.log("success!");
        }
    }

    @SubscribeMessage("addFriend")
    async sendFriendRequest(socket: Socket, data: InteractionDto)
    {
        const success: number = await this.chatservice.sendFriendRequest(data);
        if (success === 404)
            socket.emit("Internal error");
        else if (success === 400)
            socket.emit("already requested");
        else
        {
            socket.emit("successfully requested", data.target);
            const targetSocket: Socket | null = this.getSocketByUser(data.target);
            if (targetSocket)
            {
                console.log("Target is online! Sending friend request signal");
                targetSocket.emit("new request", data.userData.nickname);
            }
        }
    }

    @SubscribeMessage("acceptRequest")
    async acceptRequest(socket: Socket, data: InteractionDto)
    {
        try {
            console.log(data.userData.nickname, "is accepting a friend request from", data.target);
            let success: number = await this.chatservice.acceptRequest(data);
            if (success === 500)
                socket.emit("Internal error");
            else if (success === 400)
            {
                console.log("This user was already their friend");
                socket.emit("already friend");
            }
            else {
                console.log("Request accepted");
                const friendStatus: string | number = await this.chatservice.getUserStatus(data.target);
                console.log("new friend's status:", friendStatus);
                const ret: any = {
                    nickname: data.target,
                    status: friendStatus
                };
                socket.emit("new friend", ret);
                const newFriendSocket: Socket = this.getSocketByUser(data.target);
                if (newFriendSocket)
                {
                    const ret: any = {
                        nickname: data.userData.nickname,
                        status: "online"
                    };
                    newFriendSocket.emit("new friend", ret);
                }
            }
        }
        catch (error) {
            console.log("Error:", error);
            socket.emit("Internal error");
        }
    }

    @SubscribeMessage("declineRequest")
    async declineRequest(socket: Socket, data: InteractionDto)
    {
        try {

            let success: number = await this.chatservice.declineRequest(data);
            if (success === 404)
                socket.emit("Internal error");
        else
            socket.emit("successfully declined", data.target);
        }
        catch (error) {
            console.log("Error:", error);
            socket.emit("Internal error");
        }
    }


    @SubscribeMessage("getFriendsList")
    async getFriendsList(socket: Socket, data: UserDataDto)
    {
        let success: Map<string, string> | number = await this.chatservice.getFriendsList(data);
        if (success === 500)
        {
            socket.emit("Internal error");
            return ;
        }
        // const mapToArray = Array.from(success.entries());

        if (success instanceof Map) {
            const mapToArray = Array.from(success.entries());
            socket.emit('friend list', mapToArray);
        }
    }

    @SubscribeMessage("getFriendRequests")
    async getFriendRequests(socket: Socket, data: UserDataDto)
    {
        try {
            let success: string[] | number = await this.chatservice.getFriendRequests(data.nickname);

            if (success === 404)
            {
                socket.emit("no such user");
                return ;
            }
            if (success === 500)
            {
                socket.emit("Internal error");
                return ;
            }
            socket.emit("pending requests", success);
        }
        catch (error) {
            console.log("Error:", error);
            socket.emit("Internal error");
        }
    }
    
    @SubscribeMessage("getPublicRooms")
    async getPublicRooms(socket: Socket)
    {
        let publicRooms: any | number = await this.chatservice.getPublicRooms();
        
        if (publicRooms === 500)
        {
            socket.emit("Internal error");
            return ;
        }
        socket.emit("public rooms", publicRooms);
    }

    @Get("roomStatus")
    async getRoomStatus(data: RoomDto)
    {
        try {
            let roomStatus: boolean | number = await this.chatservice.getRoomStatus(data.roomName);   
            return (roomStatus);
        }
        catch (err) {
            console.log("Internal error:", err);
            return (500);
        }
    }
    
    
    @SubscribeMessage("roomMessage") // fonctions db pas encore faites
    async handleMessageInRoom(socket: Socket, data: RoomMessageDto)
    {
        try {
            // console.log("receiving message", data.message, "from", data.userData.nickname);
            // vérifier que le user n'est pas muté et qu'il est bien dans la room
            const roomName: string = data.roomName;
            const msg: string = data.message;
            
            let success: number = await this.chatservice.newMessageInRoom(data);
            if (success === 500)
            {
                socket.emit("Internal error");
                return ;
            }
            else if (success === 401)
            {
                socket.emit("not in room");
                return ;
            }
            else if (success === 404)
            {
                socket.emit("no such room");
                return ;
            }
            
            const dataToSend = {
                user: data.userData.nickname,
                message: msg
            };
            socket.to(roomName).emit("room message", dataToSend);
            socket.emit("message sent", dataToSend);
        }
        catch (error) {
            console.log("Internal error:", error);
            socket.emit("Internal error");
        }
    }
    

    @SubscribeMessage("privateMessage")
    async sendPrivateMessage(socket: Socket, data: DirectMessageDto)
    {
        // console.log("receiving a message from", data.userData.nickname, "for", data.recipient);
        const recipient: string = data.recipient;
        const recipientSocket: Socket = this.getSocketByUser(recipient);

        const success: number | any = await this.chatservice.sendPrivateMessage(data);
        if (success === 404)
        {
            console.log("user not found");
            socket.emit("user not found");
            return ;
        }
        if (recipientSocket)
        {
            recipientSocket.emit("private message", success);
        }
    }

    @SubscribeMessage("getPrivateConversation")
    async getDms(socket: Socket, data: InteractionDto)
    {
        try {
            const dms: any[] | number = await this.chatservice.getDms(data);
            if (dms === 500)
                socket.emit("Internal error");
            else
                socket.emit("dms conversation", dms);
        }
        catch (error) {
            console.log("Error:", error);
            socket.emit("Internal error");
        }
    }

    @SubscribeMessage("getConvosList")
    async getPrivateConvosList(socket: Socket, data: UserDataDto)
    {
        try {
            // console.log("receiving convos request from", data.nickname);
            const dms: string[] | number = await this.chatservice.getPrivateConvosList(data);
            // console.log("retrieved value  of dms", dms);
            
            if (dms === 500)
            {
                console.log("Error somewhere")
                socket.emit("Internal error");
            }
            else
                socket.emit("private convos list", dms);
        }
        catch(error) {
            console.log("Error:", error);
            socket.emit("Internal error");
        }
    }

    @SubscribeMessage("userExists")
    async userExists(socket: Socket, target: string)
    {
        try {
            let success: boolean = await this.chatservice.userExists(target);
            socket.emit("user exists", success);
        }
        catch(error) {
            console.log("Error:", error);
            socket.emit("Internal error");
        }
    }

    @SubscribeMessage("checkFriendship")
    async checkFriendship(socket: Socket, data: InteractionDto)
    {
        try {
            const success: boolean | number = await this.chatservice.checkFriendship(data);

            if (success === 404)
                return ;
            socket.emit("friendship status", success);
        }
        catch (error) {
            console.log("Error:", error);
        }
    }

    @SubscribeMessage("getGameHistory")
    async getGameHistory(socket: Socket, target: string)
    {
        console.log("Attempting to get", target, "'s game history");
        let history = await this.chatservice.getGameHistory(target);
        if (history === 500)
        {
            socket.emit("Internal error");
            return ;
        }
        console.log("Game history sent:", history);
        console.log("Type of history:", typeof(history));
        socket.emit("game history", history);
    }

    @SubscribeMessage("inviteToGame")
    async inviteToGame(socket: Socket, data: InteractionDto)
    {
        try {
            // console.log(data.userData.nickname, "is inviting", data.target, "to a game");
            let targetSocket = this.getSocketByUser(data.target);
            if (targetSocket)
                targetSocket.emit("game invite", data.userData.nickname);
        }
        catch (error) {
            console.log("Error:", error);
            socket.emit("Internal error");
        }
    }
}