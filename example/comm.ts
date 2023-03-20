type Basic = { 
  token : string;
};

type User = { 
  id : string;
  name : string;
  age : string;
  fullName : string;
  address : string;
};

type GetUserByIdReq = { 
  id : number;
  basic : Basic;
};

type GetUserByIdRes = { 
  code : number;
  message : string;
  data : User;
};

type GetUserListReq = { 
  basic : Basic;
  ids : Array<number>;
};

type GetUserListRes = { 
  code : number;
  message : string;
  data : Array<User>;
};

