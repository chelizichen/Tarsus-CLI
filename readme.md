# Tarsus-CLI

## includes

- Tarsus-Stream
  - Taro-Command
    - taro to java comm.taro -p com.tarsus.example.Test.taro
    - taro to ts comm.taro

````taro
/**
 * *********************************************
 * Tarsus-Objecet = Taro
 * @link Tarsus-CLI https://github.com/chelizichen/Tarsus-CLI
 * @author chelizichen<1347290221@qq.com>
 * @extends TarsusFarameWork https://github.com/chelizichen/TarsusFrameWork
 * @version 1.0.0
 * **********************************************
*/

struct TestParams  {
  
  Info              : {
    1       desc    : string; // 商品描述 测试
    2       url     : string; // 商品URL
    3       sort    : string; // 商品分类
  };

  Good              : {
    1       id      : int;    // 商品ID
    2       name    : string; // 商品名称
    3       price   : int;    // 商品价格
    4       info    : Info;   // 商品基本信息
  };

  GetGoodReq        : {
    1       id      : int;    // 商品ID
    2       basic   : string; // 商品基本信息
    3       message : string; // 商品信息
    4       isNew   : bool;   // 是否为上新
  };

  GetGoodRes        : {
    1       data    : Good;   // 返回值
    2       code    : int;    // 状态码
    3       message : string; // 信息
  };

  GetGoodsListReq    : {
    1       message : string; // 信息
    2       ids     : Set<int>; // 商品IDs
  };
  
  GetGoodsListRes   : {
    1       data    : List<Good>; // 商品列表
    2       code    : int;        // 商品状态码
    3       message : string;     // 商品信息
  };
};


````
