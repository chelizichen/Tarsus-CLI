import {Controller,Get} from 'tarsus/core/httpservice'
import UserService from '../service/UserService';
import {Inject} from 'tarsus/core/ioc'

@Controller("user")
class UserController{

    @Inject(UserService) UserService:UserService;

    @Get("list")
    public async getList(){
        return []
   }
}

export default UserController