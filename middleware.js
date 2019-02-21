const masterKey = process.env.ACCESS_KEY;

const validateKey = (request, response, next) => {
  let key = request.headers['access-key'];
  if (key === masterKey) { 
    next();
  }
  else {
    response.json({
      success: false,
      message: 'Invalid Access Key'
    });
  }
};

module.exports = { validateKey };