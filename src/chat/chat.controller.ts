import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { User } from "src/auth/login-strategies/user.decorator";
import { UserActive } from "src/common/interfaces/userActive.interface";
import { ChatService } from "./chat.service";
import { CreateRoomDto } from "./dto/create-chat.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() payload: CreateRoomDto) {
    return await this.chatService.create(payload);
  }

  @Get("rooms-group")
  async findAllRooms() {
    return await this.chatService.findAllRoomGroup();
  }

  @Get("my-rooms")
  async findAllMyRooms(@User() user: UserActive) {
    return await this.chatService.findAllMyRooms(user.username);
  }

  @Get("room/:roomId")
  async findRoomById(
    @User() user: UserActive,
    @Param("roomId") roomId: string,
  ) {
    return await this.chatService.findRoomById(user, roomId);
  }
}
