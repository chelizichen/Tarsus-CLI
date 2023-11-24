import {Stream, TarsusInterFace, TarsusMethod} from "tarsus/core/microservice";
import { GetSystemLoadInfoReq, GetSystemLoadInfoRes } from "../struct/TaroSystem";


interface  SystemInterFace {
    getLoadInfo(Request:GetSystemLoadInfoReq,Response:GetSystemLoadInfoRes):Promise<GetSystemLoadInfoRes> 
}


@TarsusInterFace("TaroInterFaceTest")
class TaroInterFaceImpl implements SystemInterFace {
    @TarsusMethod
    @Stream("GetSystemLoadInfoReq","GetSystemLoadInfoRes")
    getLoadInfo(Request: GetSystemLoadInfoReq, Response: GetSystemLoadInfoRes): Promise<GetSystemLoadInfoRes> {
        return Promise.resolve(Response)
    }

}

export default TaroInterFaceImpl;
