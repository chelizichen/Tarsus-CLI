class Basic{ 
 public token : string;
constructor(...args:any[]){ 
this.token = args[1];
 }
};
class User{ 
 public id : string;
 public name : string;
 public age : string;
 public fullName : string;
 public address : string;
constructor(...args:any[]){ 
this.id = args[1];
 this.name = args[2];
 this.age = args[3];
 this.fullName = args[4];
 this.address = args[5];
 }
};
class GetUserByIdReq{ 
 public id : number;
 public basic : Basic;
constructor(...args:any[]){ 
this.id = args[1];
 this.basic = new Basic(...args[2]) 
}
};
class GetUserByIdRes{ 
 public code : number;
 public message : string;
 public data : User;
constructor(...args:any[]){ 
this.code = args[1];
 this.message = args[2];
 this.data = new User(...args[3]) 
}
};
class GetUserListReq{ 
 public basic : Basic;
 public ids : Array<number>;
constructor(...args:any[]){ 
this.basic = new Basic(...args[1]) 
this.ids = JSON.parse(args[2]);
}
};
class GetUserListRes{ 
 public code : number;
 public message : string;
 public data : Array<User>;
constructor(...args:any[]){ 
this.code = args[1];
 this.message = args[2];
 this.data = JSON.parse(args[3]).map(item=>new User(...Object.values(item))); 
}
};
