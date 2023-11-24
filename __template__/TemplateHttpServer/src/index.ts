import UserController from "./controller/UserController";
import {TarsusHttpApplication,LoadController,LoadInit,LoadStruct,LoadTaro,LoadServer} from 'tarsus/core/httpservice'

@TarsusHttpApplication
class HttpServer{
    static main(){
        LoadController([UserController])
        // init
        LoadInit((app)=>{
            console.log("hello world")
        });
        LoadStruct()
        LoadTaro()
        // load
        LoadServer({
            load_ms:false
        })
    }
}

HttpServer.main()