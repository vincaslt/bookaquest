import { IsNotEmpty, IsString } from 'class-validator'

export class CreateEscapeRoomDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string
}
