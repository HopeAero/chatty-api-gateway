import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, lastValueFrom } from "rxjs";
import { UserActive } from "src/common/interfaces/userActive.interface";
import { CHAT_SERVICE } from "src/config";
import { extractErrorDetails } from "../utils/extractErrorDetails";
import { CreateRoomDto } from "./dto/create-chat.dto";

@Injectable()
export class ChatService {
  constructor(@Inject(CHAT_SERVICE) private client: ClientProxy) {}

  async create(payload: CreateRoomDto) {
    const response = await lastValueFrom(
      this.client.send("create_room", payload).pipe(
        catchError((error) => {
          const { status, message } = extractErrorDetails(error);
          throw new HttpException(message, status);
        }),
      ),
    );

    return response;
  }

  async findAllMyRooms(username: string) {
    const response = await lastValueFrom(
      this.client.send("my_rooms", username).pipe(
        catchError((error) => {
          const { status, message } = extractErrorDetails(error);
          throw new HttpException(message, status);
        }),
      ),
    );

    return response;
  }

  async findRoomById(user: UserActive, roomId: string) {
    const payload = {
      username: user.username,
      roomId,
    };

    console.log(payload);

    const response = await lastValueFrom(
      this.client.send("room_by_id", payload).pipe(
        catchError((error) => {
          const { status, message } = extractErrorDetails(error);
          throw new HttpException(message, status);
        }),
      ),
    );

    return response;
  }

  async findAllRoomGroup() {
    const response = await lastValueFrom(
      this.client.send("rooms_group", {}).pipe(
        catchError((error) => {
          const { status, message } = extractErrorDetails(error);
          throw new HttpException(message, status);
        }),
      ),
    );

    return response;
  }
}
