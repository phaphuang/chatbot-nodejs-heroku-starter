const express = require('express');
const middleware = require('@line/bot-sdk').middleware
const Client = require('@line/bot-sdk').Client
const app = express()

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

function handleEvent(event) {
  let msg = {
    type: "text",
    text: "ทดสอบ"
  }
  return client.replyMessage(event.replyToken, msg)
}

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})

