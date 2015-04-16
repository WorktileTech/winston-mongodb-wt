# winston-mongodb for web

参考：https://github.com/winstonjs/winston-mongodb

1. 支持log和error 日志的分开存储
2. 支持错误信息 pub 到 redis中

## Usage
 ```
  var winston = require('winston');

  /**
   * Requiring `winston-mongodb-wt` will expose
   * `winston.transports.MongoDB`
   */
  require('winston-mongodb-wt').MongoDB;

  winston.add(winston.transports.MongoDB, options);
```

## options 参数说明

1. level: 错误级别, 默认 'info'.
1. db: mongodb 连接字符串.
1. collection:默认日志表的集合，默认为 log
1. errorCollection：错误日志表存储的集合，默认和collection相同
1. options: MongoDB connection parameters (optional, defaults to {db: {native_parser: true}, server: {poolSize: 2, socketOptions: {autoReconnect: true}}}).
1. storeHost: Boolean indicating if you want to store machine hostname in logs entry, if set to true it populates MongoDB entry with 'hostname' field, which stores os.hostname() value.
1. label: 存储在Log表中，可以作为 app name 区分日志.
1. name: Transport instance identifier. Useful if you need to create multiple MongoDB transports.
1. redis，level为error pub到 redis 中去，格式为：
```
redis:{
    port:xxx,
    host:xxx,
    password:xxx,
    options:xxx
    channel:xxx,//默认logError
}
```
