var winston = require('winston');

/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
var MongoDB = require('../lib/winston-mongodb-wt').MongoDB;

var transport = new MongoDB({
    label          : 'wtweb',
    db             : "mongodb://localhost:27017/wtlog",
    errorCollection: "error"
});
winston.add(transport, {}, true);

winston.info("哈哈 我是info", {op: 123});
winston.info("哈哈 我是info1", "dddd", {op: 123, oid: 1111});

winston.error("哈哈 error1", {op: 123});

winston.error("哈哈 error2", "eeee", {op: 123, oid: 222});

transport.addDuration("api 测试", 30);