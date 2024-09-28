import { Expose } from "class-transformer";

export class CreateUserDo {
    @Expose()
    username: String
}