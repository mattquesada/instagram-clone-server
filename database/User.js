const Pool = require('pg').Pool;

// TODO - change this config for production environment
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5000
});

// TODO - add insertID to the query response
const addUser = (request, response) => {
  const { username, email, password} = request.body.user;
  const query = ` INSERT INTO users (username, email, password) 
                  VALUES ($1, $2)`;
  const queryArgs = [username, email, password];

  pool.query(query, queryArgs, (error, results) => {
    if (error) throw error;
    response.status(201).send(`User added successfully`); 
  });
};

const getUser = (request, response) => {
  const username  = request.body.username;
  const query = ` SELECT U.username 
                  FROM USERS U 
                  WHERE U.username = $1`;

  pool.query(query, [username], (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
  });
};

module.exports = {
  addUser,
  getUser
};