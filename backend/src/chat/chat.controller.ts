import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller("chat")
export class ChatController
{
    constructor(private chatservice: ChatService) {}

}

