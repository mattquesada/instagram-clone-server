const { Client } = require('pg');

const initClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
};

const sendGenericQuery = query => {
  client.connect();
  client.query(query, (error, results) => {
    if (error) throw error;
    client.end();
  });
};

module.exports = { initClient, sendGenericQuery };