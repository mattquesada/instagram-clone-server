const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

const db = require('./database/User');
const middleware = require('./middleware');
const awsUtils = require('./aws/Aws');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', middleware.validateKey, (request, response) => {
  response.json({ info: 'Node.js, Express, Postgres API' });
});

// endpoints for postgres
app.get('/user', middleware.validateKey, db.getUser);
app.post('/user', middleware.validateKey, db.addUser);
app.get('/allUsers', middleware.validateKey, db.getAllUsers);
app.post('/biography', middleware.validateKey, db.updateBiography);
app.post('/addFollow', middleware.validateKey, db.addFollow);
app.post('/removeFollow', middleware.validateKey, db.removeFollow);
app.get('/followers', middleware.validateKey, db.getFollowers);

// endpoints for AWS S3
app.post('/image', middleware.validateKey, awsUtils.uploadImage);
app.get('/image', middleware.validateKey, awsUtils.getImageUrl);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});