import { GetUserByIdReq, GetUserByIdRes, GetUserListReq, GetUserListRes } from "./TaroUser"

interface  TaroInterFace {
    getUserById(Request:GetUserByIdReq,Response:GetUserByIdRes):number 
    getUserList(Request:GetUserListReq,Response:GetUserListRes):number 
}

class TaroInterFaceImp implements TaroInterFace{
  getUserById(Request: GetUserByIdReq, Response: GetUserByIdRes): number {
    return 0;
  }
  getUserList(Request: GetUserListReq, Response: GetUserListRes): number {
    return 0;
  }

}