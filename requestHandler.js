var torequest = require('request');
var secretData = require('./secretData');

var webhookCheck = (request) => {
  console.log(request);
  console.log(request.queryString['hub.mode']);
  console.log(request.queryString['hub.challenge']);
  if (request.queryString['hub.mode'] === 'subscribe' &&
      request.queryString['hub.verify_token'] ==='123456') {
    return Number(request.queryString['hub.challenge']);
  }else {
    console.log('internal error');
    return 'Error!';
  }
};

var post_messageBOT = (request) => {
  let page_access_token = secretData.page_access_token;
  console.log(JSON.stringify(request.body));
  console.log(page_access_token);
  if (request.body.entry[0].messaging) return '200 OK';
  let node = request.body.entry[0].changes[0].value.comment_id;
  let edge = 'private_replies';
  // let message = 'You send: ' +
  //  request.body.entry[0].changes[0].value.message;
  let message = '優惠碼：54321';
  console.log(node);
  var options = { method: 'POST',
    url: `https://graph.facebook.com/v2.10/${node}/${edge}`,
    headers:
    { 'content-type': 'application/x-www-form-urlencoded' },
    form: { message, access_token:page_access_token }
  };
  console.log(options);
  return asyncFunction(options);
};
function asyncFunction(options) {
  return new Promise((resolve, reject) => {
    torequest(options,
    function (error, response, body) {
      console.log('test');
      if (error) console.log(error);
      console.log('In callback');
      console.log(response.body);
      return resolve('200 OK HTTPS');
    });
  })
};

var messenger = (request) => {
  console.log(request);
  let data = request.body;
  if (data.object === 'page') {
    data.entry.forEach((entry) => {
      var pageID = entry.id;

      entry.messaging.forEach((event) => {
        if (event.message) {
          receicedMessage(event);
        } else {
          console.log(`Received unknown event: ${event}`);
        }
      });
    });
  }
};

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var message = event.message;

  console.log(`Recived message for user ${senderID} and
      page ${recipientID} with message: ${message}`);

  var messageID = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received!");
  }
}

function sendGenericMessage(recipientID, messageText) {

}

function sendTextMessage(recipientID, messageText) {
  var messageData = {
    recipient: {
      id: recipientI
    },
    message: {
      text: messageText
    }
  };

  return callSendAPI(messageData);
}

function callSendAPI(messageData) {
  var PAGE_ACCESS_TOKEN = secretData.page_access_token;
  return new Promise((resolve, reject) => {
    torequest({
      uri: 'https://graph.facebook.com/v2.10/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN  },
      method: 'POST',
      json: messageData
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var recipientID = body.recipient_id;
        var messageID = body.message_id;

        console.log(`Successfully sent generic message with id ${messageID}
            to recipient ${recipientID}`);
      } else {
        console.error('Unable to send message.');
        console.error(response);
        console.error(error);
      }
    }
    );
  });
}

module.exports = {
  post_messageBOT,
  webhookCheck,
  messenger
}


