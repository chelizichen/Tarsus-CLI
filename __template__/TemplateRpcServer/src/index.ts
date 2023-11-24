import {
  LoadInterface,
  LoadServer,
  LoadStruct,
  LoadTaro,
  TarsusMsApplication
} from "tarsus/core/microservice";
import TaroInterFaceImpl from "./interface/TaroInterFace";

@TarsusMsApplication
class MicroService {
  static main() {
    LoadInterface([TaroInterFaceImpl]);
    LoadTaro();
    LoadStruct();
    LoadServer();
  }
}

MicroService.main();
