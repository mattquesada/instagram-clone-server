const utils = require('./Utils');

const addImage = (request, response) => {
  const client = utils.initClient();
  const { userID, imageURL } = request.body;
  const currentTime = new Date().toLocaleString();

  const query = 
  ` 
    INSERT INTO images (ImageURL, UserID, DatePosted)
    VALUES ('${imageURL}', '${userID}', '${currentTime}')
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send({ status: 'image added successfully' });
    client.end();
  });
}

const updateCaption = (request, response) => {
  const client = utils.initClient();
  const { imageID, caption } = request.body;
  const query = 
  `
    UPDATE images 
    SET Caption = '${caption}'
    WHERE ImageID = '${imageID}'
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send(`Caption updated successfully`);
    client.end();
  });
}

const getImages = (request, response) => {
  const client = utils.initClient();
  const userID = request.query['userID'];
  const query = 
  `
    SELECT * 
    FROM images
    WHERE UserID = '${userID}'
  `

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

// given an array of userIDs, fetch all images owned
// by every User 
const getImagesWithMultipleUsers = (request, response) => {
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

  const query =
  `
    SELECT *
    FROM images
    WHERE UserID IN (${userIDs.join()});
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

const getAllImages = (request, response) => {
  const client = utils.initClient();
  const query = `SELECT * FROM images`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

const updateLikes = (request, response) => {
  const client = utils.initClient();
  const { imageID } = request.body; 
  const query = 
  `
    UPDATE images
    SET Likes = Likes + 1
    WHERE imageID = '${imageID}'
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send({status: 'Likes count updated successfully'});
    client.end();
  });
}

const countLikes = (request, response) => {
  const client = utils.initClient();
  const userID = request.query['userID'];
  const query =
    `
    SELECT SUM(likes)
    FROM images
    WHERE userID = '${userID}'
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows[0]);
    client.end();
  });
}

module.exports = {
  addImage,
  updateCaption,
  getImages,
  getImagesWithMultipleUsers,
  getAllImages,
  updateLikes,
  countLikes
}