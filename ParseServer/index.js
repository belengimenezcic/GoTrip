// Parser server configuration 

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
const path = require('path');
const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));
const SimpleSendGridAdapter = require('parse-server-sendgrid-adapter');

const databaseUri = process.env.MONGODB_URI;

var options = { allowInsecureHTTP: true };

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
const config = {
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'GoTripAppID',
  masterKey: process.env.MASTER_KEY || '==HyUH78YT$5%33==*&99', 
  serverURL: process.env.SERVER_URL || 'https://gotrip-app.herokuapp.com/api', // Don't forget to change to https if needed
  liveQuery: {
    classNames: ['Comment', 'Note'], // List of classes to support for query subscriptions
  },
  publicServerURL: 'https://gotrip-app.herokuapp.com/api', // change by the Heroku url to make it able confirm and reset the email and password
  appName: 'GoTrip',
  emailAdapter: SimpleSendGridAdapter({
    apiKey: process.env.SENDGRID,
    fromAddress: 'info@go-trip.tech',
  })
};

const app = express();

//Dashboard configuration
var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": "https://gotrip-app.herokuapp.com/api",
      "appId": "GoTripAppID",
      "masterKey": "==HyUH78YT$5%33==*&99",
      "appName": "GoTrip",
      "iconName": "goTrip-logo.png",
    }
  ], 
  "iconsFolder": "icons",
  "users": 
  [
    {
        "user":"goTrip",
        "pass":"goTrip123",
        "apps": [{"appId": "GoTripAppID"}]
    }
  ]
}, options);

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/api';
if (!test) {
  const api = new ParseServer(config);
  app.use(mountPath, api);
}

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

const port = process.env.PORT || 1337;
if (!test) {
  const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('GoTrip server running on port ' + port + '.');
  });
  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer);
}

module.exports = {
  app,
  config,
};
