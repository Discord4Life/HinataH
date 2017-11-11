const client = require('../singletons/client.js');
const Logger = require('../utility/Logger.js');

client.on('warn', (warning) => Logger.log(warning, 'WARNING'));
