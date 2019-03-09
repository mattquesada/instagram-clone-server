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
  const { caption, imageID } = request.body;

  // parse the caption to extract the hashtags
  let words = caption.split(' ');
  let hashtags = [];
  let captionWords = [];
  for (word of words) {
    if (word.charAt(0) === '#') {
      let hashtag = word.slice(1);
      hashtags.push(hashtag);
    }
    else {
      captionWords.push(word);
    }
  }
  let parsedCaption = captionWords.join(' ');

  let addCaptionQuery = 
  `
    UPDATE images
    SET caption = '${parsedCaption}'
    WHERE imageid = '${imageID}'
  `;

  // start of the query string -> we need to build this out to 
  // add a variable amount of hashtags in one query
  let addHashtagsBaseQuery = 'INSERT INTO hashtags (hashtag_text, image_id) VALUES '; 
  for (hashtag of hashtags) 
    addHashtagsBaseQuery += `('${hashtag}', '${imageID}'), `;

  // trim the end of the query string
  let addHashtagsQuery = addHashtagsBaseQuery.substring(0, addHashtagsBaseQuery.length - 2);

  // execute the SQL queries
  client.connect();
  client.query(addCaptionQuery, (error, results) => {
    if (error) throw error;
  });

  client.query(addHashtagsQuery, (error, results) => {
    if (error) throw error;
    response.status(201).send({status: 'caption and hashtags updated successfully'});
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

const addComment = (request, response) => {
  const client = utils.initClient();
  const { imageID, userID, commentText } = request.body;
  const query = 
  `
    INSERT INTO comments (comment_text, image_id, user_id)
    VALUES ('${commentText}', '${imageID}', '${userID}')
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(201).send({status: 'Comment added successfully'});
    client.end();
  });
}

const getAllComments = (request, response) => {
  const client = utils.initClient();
  const query = `SELECT * FROM comments`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

const getCommentsByImageID = (request, response) => {
  const client = utils.initClient();
  const imageID = request.query['imageID'];
  const query = 
  `
    SELECT c.comment_text, u.username 
    FROM comments c
    INNER JOIN users u
    ON c.user_id = u.UserID
    WHERE c.image_id = '${imageID}'
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

// get hashtags for a given image
const getHashtags = (request, response) => {
  const client = utils.initClient();
  const imageID = request.query['imageID'];
  const query = 
  `
    SELECT hashtag_text 
    FROM hashtags
    WHERE image_id = '${imageID}'
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    let trimmedResults = results.rows.map(row => row.hashtag_text);
    response.status(200).send(trimmedResults);
    client.end();
  });
}

const getAllHashtags = (request, response) => {
  const client = utils.initClient();
  const query = `SELECT * FROM hashtags`;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

const searchHashtags = (request, response) => {
  const client = utils.initClient();
  const hashtagText = request.query['hashtagText'];
  let query = 
  `
    SELECT COUNT(hashtag_text), hashtag_text
    FROM (
        SELECT *
        FROM hashtags h
        WHERE h.hashtag_text LIKE '${hashtagText}%'
    ) AS derived_table
    GROUP BY hashtag_text
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
    client.end();
  });
}

const getImagesByHashtags = (request, response) => {
  const client = utils.initClient();
  const hashtag = request.query['hashtag'];
  let query = 
  `
    SELECT i.imageurl, i.caption, i.likes AS numLikes, u.username AS poster
    FROM images i
    INNER JOIN hashtags h ON i.imageid = h.image_id
    INNER JOIN users u ON i.userid = u.userid
    WHERE h.hashtag_text = '${hashtag}'
  `;

  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    response.status(200).send(results.rows);
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
  countLikes,
  addComment,
  getAllComments,
  getCommentsByImageID,
  getHashtags,
  getAllHashtags,
  searchHashtags,
  getImagesByHashtags
}