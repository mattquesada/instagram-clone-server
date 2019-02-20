const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// TODO - add insertID to the query response
const addUser = (request, response) => {
  const { username, email, password} = request.body.user;
  const query = ` INSERT INTO users (username, email, password) 
                  VALUES ($1, $2)`;
  const queryArgs = [username, email, password];

  client.connect();
  client.query(query, queryArgs, (error, results) => {
    if (error) throw error;
    response.status(201).send(`User added successfully`); 
    client.end();
  });
};

const getUser = (request, response) => {
  const username  = request.body.username;
  const query = ` SELECT U.username 
                  FROM USERS U 
                  WHERE U.username = $1`;
  
  client.connect();
  client.query(query, [username], (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
};

module.exports = {
  addUser,
  getUser
};