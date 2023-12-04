import { Controller, Post, Body, Get, UploadedFile, UseInterceptors, Query } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from "./user.service";
import { UserDataDto } from "src/auth/dto";
import { InteractionDto, NicknameChangeDto } from "./dto";
import { multerConfig } from "src/config/multer.config";

@Controller("user")
export class UserController
{
    constructor(private userservice: UserService) { }

    @Get("data")
    getUserData(@Body() nickname: string)
    {
        return (this.userservice.getUserData(nickname));
    }

    @Post("newnickname")
    async changePseudo(@Body() data: NicknameChangeDto)
    {
        try {
            let update: boolean | number = await this.userservice.changePseudo(data.userData.nickname, data.newNickname);
            return (update);
        }
        catch (error)
        {
            console.log("Internal error", error);
        }
    }

    @Post("newProfilePic")
    @UseInterceptors(FileInterceptor("profileImage", multerConfig))
    async changeProfilePic(@UploadedFile() image:Express.Multer.File, @Body('userData') userData: string) : Promise<string | boolean>
    {
        try {
            console.log("receiving request:", userData);
            // console.log("userData:",userData)
            const userDataObj = JSON.parse(userData);
            console.log("receiving request 2:", userDataObj);
            const nickname : string = userDataObj.nickname;
            const imageUrl: string = `http://159.65.54.159:3000/uploads/${nickname}.jpg`;

            let success: number = await this.userservice.newProfilePic(imageUrl, userDataObj);
            if (success === 500)
                return (false);
            return (imageUrl);
        }
        catch(error)
        {
            console.log("error:", error);
            return (false);
        }
    }

    @Get("info")
    async getUserInfo(@Query("nickname") target: string)
    {
        try {
            // const target: string = data.target;

            let success: any = await this.userservice.getUserInfo(target);

            return (success);
        }
        catch (error) {
            console.log("Error:", error);
            return(500);
        }
    }
}