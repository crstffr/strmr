
require('serverless-helpers-js').loadEnv();
var Magnet = require('../../../common/magnet');
var response = require('../../../common/respond');

module.exports.handler = function (event, context) {

    var magnet = new Magnet(event.uri);

    if (!magnet.isValid) {
        context.done(null, response.error('Unable to parse magnet link', magnet.errors));
        return;
    }

    context.done(null, response.data(magnet));

};
