const express = require('express');
const middleware = require('@line/bot-sdk').middleware
const Client = require('@line/bot-sdk').Client
const app = express()

const http = require('http')

app.get('/', function (req, res) {
	res.send('chatbot-nodejs-heroku-starter!! Yeh, the text is coming now');
})

const config = {
  channelAccessToken: '4VPAtZl2QMNkJFMfgq4iaXSsfwk5jWHprOp79XOlx/uZC4sJv+TGMIoxi2rhe0CsDodpfOnUNmsLfsDJdmviCKCJ/zKuOzO8cyj1jkWG11GXwwrwfVvICVwB9JcNzF0ep7uReGXiLbfVW/4SYcs+1QdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'c50e7a25427aee377dbf0e1bb6d5193c'
}

const client = new Client(config)

app.post('/webhook', middleware(config), (req, res) => {
  res.sendStatus(200)
  console.log(req.body.events) // webhook event objects
  console.log(req.body.destination) // user ID of the bot (optional)
  Promise
    .all(req.body.events.map(handleEvent))
})

var lat = "";
var long = "";
var url = "";
var resAqi = "";

function Get(yourUrl){
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET",yourUrl,false);
  Httpreq.send(null);
  return Httpreq.responseText;          
}

function handleEvent(event) {
  if (event.message.type === "location") {
    latitude = event.message.latitude
    longitude = event.message.longitude
    url = 'http://fathomless-reaches-36581.herokuapp.com/api?lat=' + lat +'&long=' + long
    http.get(url, function(res){
      var body = '';
  
      res.on('data', function(chunk){
          body += chunk;
      });
  
      res.on('end', function(){
          //var fbResponse = JSON.parse(body);
          //console.log("Got a response: ", fbResponse);
          resAqi = JSON.parse(body);
      });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });

    let msg = {
      "type": "template",
      "altText": "this is a carousel template",
      "template": {
          "type": "carousel",
          "columns": [
          ],
          "imageAspectRatio": "rectangle",
          "imageSize": "cover"
      }
    }

    let obj = {
      "thumbnailImageUrl": "",
      "imageBackgroundColor": "#FFFFFF",
      "title": "",
      "text": "description",
      "defaultAction": {
          "type": "uri",
          "label": "View detail",
          "uri": "http://example.com/page/123"
      },
      "actions": [
          {
              "type": "uri",
              "label": "View history",
              "uri": "http://example.com/page/111"
          }
      ]
    }

    return client.replyMessage(event.replyToken, msg)
  }
}

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})

