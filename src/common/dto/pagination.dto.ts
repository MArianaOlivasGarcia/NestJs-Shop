import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";



export class PaginationDto {

    @IsOptional()
    @IsPositive()
    // En el query de la url llega como string, tengo que convetirlo a numero
    @Type( () => Number ) // es como si pusieramos el enableImplictConvertion: true
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type( () => Number )
    page?: number;

}