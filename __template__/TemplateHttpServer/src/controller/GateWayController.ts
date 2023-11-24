import { $Transmit, Controller, INVOKE } from "tarsus/core/httpservice";

@Controller("gateway")
class GateWayController{
    
    @INVOKE('/invoke')
    invoke(req,res){
        $Transmit(req,res)
    }
}


export default GateWayController