import { TarsusDTO, IsInt, IsString, MinLen, MaxLen, Required, CheckStatus } from "tarsus/core/httpservice";

@TarsusDTO()
class UserDTO{
    @IsInt()
    age:number;

    @IsString()
    @MinLen(1)
    @MaxLen(10)
    name:string;

    @Required()
    email:string;

    @CheckStatus([1,2,3,4])
    status:number;
}

export default UserDTO