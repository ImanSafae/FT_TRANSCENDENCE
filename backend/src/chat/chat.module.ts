import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { DatabaseService } from "src/database/database.service";
import { DatabaseModule } from "src/database/database.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [DatabaseModule, PrismaModule],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService, DatabaseService]
})
export class ChatModule
{

}
