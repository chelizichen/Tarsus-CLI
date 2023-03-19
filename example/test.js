const { TarsusStream } = require("../src/index");

let stream_test = new TarsusStream("example/test.taro");

let taro = {
  GetGoodReq: {
    req: "GetGoodReq",
    data: {
      id: 1,
      message: "测试",
      isNew: undefined,
    },
  },
  GetGoodRes: {
    req: "GetGoodRes",
    data: {
      data: {
        price: 1123,
        id: 1,
        name: "测试商品",
        info: {
          url: "路径",
          sort: "分类",
          desc: "描述",
        },
      },
      message: "测试",
      code: 1,
    },
  },
};

let queryList = {
  GetGoodsListReq: {
    req: "GetGoodsListReq",
    data: {
      message: "测试",
      ids: [1, 2, 3, 4, 5, 1],
    },
  },
  GetGoodsListRes: {
    req: "GetGoodsListRes",
    data: {
      code: 1,
      message: "ok",
      data: [
        {
          id: 1,
          name: "测试商品",
          info: {
            url: "路径",
            sort: "分类",
            desc: "描述",
          },
          price: 1123,
        },
        {
          price: 1123,
          id: 1,
          info: {
            url: "路径",
            sort: "分类",
            desc: "描述",
          },
          name: "测试商品",
        },
        {
          price: 1123,
          name: "测试商品",
          info: {
            url: "路径",
            sort: "分类",
            desc: "描述",
          },
          id: 1,
        },
      ],
    },
  },
};

// const _data1 = TarsusStream.parse(taro.GetGoodReq);
// const _data2 = TarsusStream.parse(taro.GetGoodRes);

// console.log(_data1);
// console.log(_data2);

debugger;
const _data3 = TarsusStream.parse(queryList.GetGoodsListReq);
// const _data4 = TarsusStream.parse(queryList.GetGoodsListRes);

console.log(_data3);
// console.log(_data4);
