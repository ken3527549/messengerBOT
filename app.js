var Apibuilder = require('claudia-api-builder'),
  api = new Apibuilder();
var requestHandler = require('./requestHandler');
module.exports = api;
api.get('/facebook', requestHandler.webhookCheck);

// api.post('/facebook', requestHandler.messenger);
api.post('/facebook', requestHandler.post_messageBOT);
// api.post('/facebook', requestHandler.test);


