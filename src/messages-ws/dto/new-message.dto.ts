import { IsString, IsUUID, MinLength } from "class-validator";




export class NewMessageDto {

    @IsString()
    @IsUUID()
    from: string

    @IsString()
    @MinLength(1)
    message: string

}