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
    response.status(201).send(`Image added successfully`);
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

module.exports = {
  addImage,
  updateCaption
}