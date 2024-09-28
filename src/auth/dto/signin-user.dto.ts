import { IsNotEmpty, IsString, Length } from "class-validator";

export class SigninUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    password: string
}