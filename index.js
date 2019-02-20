const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

const db = require('./database/User');

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (request, response) => {
  response.json({info: 'Node.js, Express, Postgres API'});
});

app.get('/user', db.getUser);
app.post('/user', db.addUser);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});