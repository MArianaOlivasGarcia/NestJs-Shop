import { IsArray, IsIn, IsString, MinLength } from "class-validator";

export class CreateCraftsmanDto {

    
    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(1)
    lastName: string;

    @IsArray()
    geoLocalization: number[];

    @IsString()
    @MinLength(1)
    admissionDate: string

    @IsIn(['male','female'])
    gender: string;



}
