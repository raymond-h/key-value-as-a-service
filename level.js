const levelup = require('levelup');
const encode = require('encoding-down');

let store;
if(process.env['DATABASE_URL'] != null) {
    const sqldown = require('sqldown');
    store = sqldown(process.env['DATABASE_URL']);
}
else {
    const memdown = require('memdown');
    store = memdown('test');
}

module.exports = levelup(encode(store));
