var respond = require('../../common/respond');
var Filemaker = require('../../common/filemaker');

module.exports = function (req, res) {

    var maker = new Filemaker(req.body.link);

    if (!maker.isValid) {
        res.end(respond.error('magnet link is not valid'));
        return;
    }

    maker.makeAll().then(function(){

        res.end(respond.ok(maker.filebase + ' files created'));

    }).catch(function(err){

        res.end(respond.error(err));

    });

};
