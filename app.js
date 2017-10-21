// dependencies
const express = require('express');
const app = express();
const OpenTok = require('opentok');

// set environment variables
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const PORT = process.env.PORT || 8080;

if (!apiKey || !apiSecret) {
  console.log('Please make sure to add your OpenTok API KEY and API SECRET');
}

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

const OT = new OpenTok(apiKey, apiSecret);

const renderRoom = (res, sessionId, token, userName) => {
  res.render('room', {
    apiKey,
    sessionId,
    token,
    userName
  });
};

const createSession = (roomId, res, userName) => {
  OT.createSession({
    mediaMode: 'routed'
  }, (error, session) => {
    if (error) {
      console.log('There was an error creating the session');
      process.exit(1);
    }
    sessionId = session.sessionId;
    app.set(roomId, sessionId);
    token = OT.generateToken(sessionId);
    renderRoom(res,sessionId, token, userName);
  });
};

app.get('/room/:rid', (req, res) => {
  const roomId = req.params.rid;
  const userName = req.query.userName;
  if (app.get(roomId)) {
    sessionId = app.get(roomId);
    const token = OT.generateToken(sessionId);
    renderRoom(res, sessionId, token, userName);
  } else {
    createSession(roomId, res, userName);
  }
});

app.get('/', (req, res) => {
  res.render('index');
})

app.listen(PORT, () => {
  console.log(`Listening to app on port: ${PORT}`);
});
