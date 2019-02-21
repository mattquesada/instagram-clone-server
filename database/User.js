const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const utils = require('./Utils');

// TODO - add insertID to the query response
const addUser = (request, response) => {
  const { username, email, password } = request.body;
  const query = ` INSERT INTO users (username, email, password)
                 VALUES ('${username}', '${email}', '${password}')`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send(`User added successfully`);
    client.end();
  });
};

const getUser = (request, response) => {
  const username = request.body.username;
  const query = ` SELECT *
                 FROM users U
                 WHERE U.username = '${username}'`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
};

const getAllUsers = (request, response) => {
  const query = `SELECT * FROM users`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
};

const updateBiography = (request, response) => {
  const query = ` UPDATE users
                 SET biography = '${biography}'
                 WHERE username = '${username}'`;
  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send(`Biography updated successfully`);
    client.end();
  });
};

const addFollow = (request, response) => {
  const { ownUsername, toFollowUsername } = request.body;
  const addFollowQuery = `INSERT INTO following_database
             (followUsername, isFollowedUsername) VALUES
             ('${ownUsername}', '${toFollowUsername}')`;
  const updateFollowerCount = `UPDATE users
                SET followersCount = followersCount + 1
                WHERE username = '${toFollowUsername}';`;
  const updateFollowingCount = `UPDATE users
                SET followingCount = followingCount + 1
                WHERE username = '${ownUsername}';`;
  utils.sendGenericQuery(updateFollowingCount);
  utils.sendGenericQuery(updateFollowerCount);
  client.connect();
  client.query(addFollowQuery, (error, results) => {
    if (error) throw error;
    response.status(201).send(`Follower added successfully`);
    client.end();
  });
};

const removeFollow = (request, response) => {
  const { ownUsername, toUnfollowUsername } = request.body;
  let removeFollowQuery = `DELETE FROM following_database
              WHERE followUsername = '${ownUsername}' AND isFollowedUsername = '${toUnfollowUsername}' `;
  let updateFollowerCount = `UPDATE users
                SET followersCount = followersCount - 1
                WHERE username = '${toUnfollowUsername}'`;
  let updateFollowingCount = `UPDATE users
                SET followingCount = followingCount - 1
                WHERE username = '${ownUsername}'`;
  utils.sendGenericQuery(updateFollowingCount);
  utils.sendGenericQuery(updateFollowerCount);
  client.connect();
  client.query(removeFollowQuery, (error, results) => {
    if (error) throw error;
    response.status(201).send(`Follower removed successfully`);
    client.end();
  });
}

const getFollowers = (request, response) => {
  const query = ` SELECT isFollowedUsername
                 FROM following_database
                 WHERE followUsername = '${username}'`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

module.exports = {
  addUser,
  getUser,
  getAllUsers,
  updateBiography,
  addFollow,
  removeFollow,
  getFollowers
};