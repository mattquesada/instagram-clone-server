const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

const middleware = require('./middleware');
const userQueries= require('./database/User');
const imageQueries = require('./database/Image');
const awsUtils = require('./aws/Aws');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', middleware.validateKey, (request, response) => {
  response.json({ info: 'Node.js, Express, Postgres API' });
});

// POSTGRES ENDPOINTS
//
// user queries
app.get('/user', middleware.validateKey, userQueries.getUser);
app.post('/user', middleware.validateKey, userQueries.addUser);
app.get('/allUsers', middleware.validateKey, userQueries.getAllUsers);
app.post('/biography', middleware.validateKey, userQueries.updateBiography);
app.post('/addFollow', middleware.validateKey, userQueries.addFollow);
app.post('/removeFollow', middleware.validateKey, userQueries.removeFollow);
app.get('/followers', middleware.validateKey, userQueries.getFollowers);

// image queries
app.post('/image', middleware.validateKey, imageQueries.addImage);
app.post('/caption', middleWare.validateKey, imageQueries.updateCaption);

// AWS S3 ENDPOINT
app.post('/imageAWS', middleware.validateKey, awsUtils.uploadImage);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});