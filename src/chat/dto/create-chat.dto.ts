import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from "class-validator";

export enum RoomType {
  SINGLE = "SINGLE",
  GROUP = "GROUP",
}

export class MemberRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class CreateRoomDto {
  @IsString()
  @ValidateIf((o) => o.type != RoomType.SINGLE)
  name?: string;

  @IsEnum(RoomType)
  @ValidateIf((o) => o.type)
  type: RoomType;

  @IsArray({ each: true })
  @ArrayNotEmpty()
  members: MemberRequest[];
}
