require('dotenv').config();
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
app.get('/userByID', middleware.validateKey, userQueries.getUserByID);
app.get('/usersByID', middleware.validateKey, userQueries.getMultipleUsersByID); 
app.get('/allUsers', middleware.validateKey, userQueries.getAllUsers);
app.post('/biography', middleware.validateKey, userQueries.updateBiography);
app.post('/addFollow', middleware.validateKey, userQueries.addFollow);
app.post('/removeFollow', middleware.validateKey, userQueries.removeFollow);
app.get('/following', middleware.validateKey, userQueries.getFollowing);
app.get('/allFollows', middleware.validateKey, userQueries.getAllFollows);
app.get('/searchUsers', middleware.validateKey, userQueries.searchUsers);
app.get('/countFollowers', middleware.validateKey, userQueries.countFollowers);

// image queries
app.post('/image', middleware.validateKey, imageQueries.addImage);
app.get('/images', middleware.validateKey, imageQueries.getImages);
app.get('/imagesByIDs', middleware.validateKey, imageQueries.getImagesWithMultipleUsers);
app.get('/allImages', middleware.validateKey, imageQueries.getAllImages);
app.post('/caption', middleware.validateKey, imageQueries.updateCaption);
app.post('/likes', middleware.validateKey, imageQueries.updateLikes);
app.get('/countLikes', middleware.validateKey, imageQueries.countLikes);
app.post('/comment', middleware.validateKey, imageQueries.addComment);
app.get('/allComments', middleware.validateKey, imageQueries.getAllComments);
app.get('/imageComments', middleware.validateKey, imageQueries.getCommentsByImageID);
app.get('/hashtags', middleware.validateKey, imageQueries.getHashtags);
app.get('/allHashtags', middleware.validateKey, imageQueries.getAllHashtags);
app.get('/searchHashtags', middleware.validateKey, imageQueries.searchHashtags);
app.get('/imagesByHashtag', middleware.validateKey, imageQueries.getImagesByHashtags);

// AWS S3 ENDPOINT
app.post('/uploadImage', middleware.validateKey, awsUtils.uploadImage);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});