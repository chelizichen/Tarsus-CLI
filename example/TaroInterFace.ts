import { GetUserByIdReq, GetUserByIdRes, GetUserListReq, GetUserListRes } from "./TaroUser"

interface  TaroInterFace {
    getUserById(Request:GetUserByIdReq,Response:GetUserByIdRes):Promise<any> 
    getUserList(Request:GetUserListReq,Response:GetUserListRes):number 
}

class TaroInterFaceImpl implements TaroInterFace{
  getUserById(Request: GetUserByIdReq, Response: GetUserByIdRes): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      
    })
  }
  getUserList(Request: GetUserListReq, Response: GetUserListRes): number {
    throw new Error("Method not implemented.")
  }

}

