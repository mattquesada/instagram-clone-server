const utils = require('./Utils');

// TODO - add insertID to the query response
const addUser = (request, response) => {
  const client = utils.initClient();
  const { username, email, password } = request.body;
  const query = ` INSERT INTO users (username, email, password)
                 VALUES ('${username}', '${email}', '${password}')`;
  
  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send({status: 'user added successfully'});
    client.end();
  });
}

const getUser = (request, response) => {
  const client = utils.initClient();
  const username = request.query['username'];
  const query = `SELECT *
                 FROM users 
                 WHERE username = '${username}'`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows[0]);
    client.end();
  });
}

const getUserByID = (request, response) => {
  const client = utils.initClient();
  const userID = request.query['userID'];
  const query = `SELECT *
                 FROM users 
                 WHERE UserID = '${userID}'`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows[0]);
    client.end();
  });
}

// given an array of ID numbers (any size),
// return all the corresponding user records 
const getMultipleUsersByID = (request, response) => {
  const client = utils.initClient();
  const stringUserIDs = request.query['userIDs'].split(',');
  const userIDs = stringUserIDs.map(str => parseInt(str));

  if (isNaN(userIDs) && !Array.isArray(userIDs)) { // if we have no userIDs, don't query postgres
    response.status(400).send([]);
    return;
  }

  if (Array.isArray(userIDs)) {
    if (isNaN(userIDs[0])) {
      response.status(400).send([]);
      return;
    }
  }

  const query = `SELECT *
                FROM users 
                WHERE UserID IN (${userIDs.join()})`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

const getAllUsers = (request, response) => {
  const client = utils.initClient();
  const query = `SELECT * FROM users`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

const searchUsers = (request, response) => {
  const client = utils.initClient();
  const searchText = request.query['searchText'];
  const query = `SELECT * 
                 FROM users
                 WHERE username LIKE '${searchText}%'`; 
  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

const updateBiography = (request, response) => {
  const client = utils.initClient();
  const { biography, username } = request.body;
  const query = `UPDATE users
                 SET biography = '${biography}'
                 WHERE username = '${username}'`;
  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send({status: 'biography updated successfully'});
    client.end();
  });
}

const addFollow = (request, response) => {
  const client = utils.initClient();
  const { ownUserID, toFollowUserID } = request.body;
  const query = 
  `
    INSERT INTO follows
    (is_following_id, is_followed_id) 
    VALUES ('${ownUserID}', '${toFollowUserID}')
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send({status: 'follow added successfully'});
    client.end();
  });
}

const removeFollow = (request, response) => {
  const client = utils.initClient();
  const { ownUserID, toUnfollowUserID } = request.body;
  let query = 
  `
    DELETE FROM follows
    WHERE is_following_id = '${ownUserID}' 
      AND is_followed_id = '${toUnfollowUserID}' 
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send({status: 'follow removed successfully'});
    client.end();
  });
}

const getFollowing = (request, response) => {
  const client = utils.initClient();
  const userID = request.query['userID'];
  const query = ` SELECT is_followed_id
                  FROM follows
                  WHERE is_following_id = '${userID}'`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

const getAllFollows = (request, response) => {
  const client = utils.initClient();
  const query = `SELECT * FROM follows`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

// count the number of users following the current user
const countFollowers = (request, response) => {
  const client = utils.initClient();
  const userID = request.query['userID'];
  const query = 
  `
    SELECT COUNT(*) 
    FROM follows 
    WHERE is_followed_id = '${userID}'
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows[0]);
    client.end();
  });
}

module.exports = {
  addUser,
  getUser,
  getUserByID,
  getMultipleUsersByID,
  getAllUsers,
  updateBiography,
  addFollow,
  removeFollow,
  getFollowing,
  searchUsers,
  getAllFollows,
  countFollowers
};