# Tarsus-CLI

## BTW

目前已支持 Taro文件映射生成对应的 TS 文件和 Java文件

Taro 可以使得参数自动化补全和类型校验。

也可以在不引入TS的情况下替代TS的功能。

## includes

````cmd
npm install tarsus-cli
````

- Tarsus-Stream
  - Taro to [type] [filePath] -p [pkg]
    - taro to java comm.taro -p com.tarsus.example.Test.taro
    - taro to ts comm.taro
  - taro inf [type] [filePath] -p [pkg]
    - taro inf java ./TaroUser.taro -p com.tarsus.example.taro

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
