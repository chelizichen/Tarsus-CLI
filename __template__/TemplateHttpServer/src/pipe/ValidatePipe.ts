import { Request } from "express";
import { TarsusPipe } from "tarsus/types/httpservice";
import { TarsusValidate, plainToInstance } from "tarsus/core/httpservice";
import UserValidateObj from "../dto/User";
import { PipeError } from "tarsus/core/httpservice";

class TestValidatePipe implements TarsusPipe {
  handle(req: Request) {
    req.body = plainToInstance(req.body, UserValidateObj);
    const check = TarsusValidate(req.body);
    console.log("check", check);
    if (!check) {
      throw PipeError();
    }
  }
}

export { TestValidatePipe };
