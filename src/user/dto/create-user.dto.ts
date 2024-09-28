import { IsNotEmpty, IsString, Length } from "class-validator";
import { Roles } from "src/roles/roles.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    username: String

    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    password: String

    roles?: Roles[] | number[]
}