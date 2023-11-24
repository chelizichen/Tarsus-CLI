import { Request } from 'express';
import { TokenError } from 'tarsus/core/httpservice'
import { TarsusJwtValidate } from 'tarsus/types/httpservice'

class TokenValidate implements TarsusJwtValidate{
    async handle(req:Request){
        console.log(req.headers.token);
        if(!req.headers.token){
            throw TokenError("没token")
        }
    }
}

export {
    TokenValidate
}