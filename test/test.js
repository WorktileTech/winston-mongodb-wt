var winston = require('winston');

/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
var MongoDB = require('../lib/winston-mongodb-wt').MongoDB;

winston.add(MongoDB, {
    label          : 'wtweb',
    db             : "mongodb://localhost:27017/wtlog",
    errorCollection: "error"
});

winston.info("哈哈 我是info", {op: 123});
winston.info("哈哈 我是info1", "dddd", {op: 123});

winston.error("哈哈 error1", {op: 123});

winston.error("哈哈 error2", "eeee", {op: 123});