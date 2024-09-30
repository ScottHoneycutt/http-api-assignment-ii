const fs = require('fs');
const query = require('querystring');

const usersObj = {};

// Loading in json response files -SJH
const createdSuccessfully = fs.readFileSync(`${__dirname}/../json/createdSuccessfully.json`);
const resourceNotFound = fs.readFileSync(`${__dirname}/../json/resourceNotFound.json`);
const badRequest = fs.readFileSync(`${__dirname}/../json/badRequest.json`);

// If GET request, respond with json object. Otherwise, just respond with the head. -SJH
const getUsers = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  if (request.method === 'GET') {
    response.write(JSON.stringify(usersObj));
  }
  response.end();
};

// resourceNotFound case response -SJH
const getNotFound = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'application/json' });
  if (request.method === 'GET') {
    response.write(resourceNotFound);
  }
  response.end();
};

// Part 2 of adding a new user (after the body was parsed) -SJH
const addUserPt2 = (request, response) => {
  const newName = request.body.name;
  const newAge = request.body.age;

  // First, check to see if there were name and age parameters passed in -SJH
  if (!newName || !newAge) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.write(badRequest);
    response.end();
  } else if (usersObj[newName]) {
    // Modify existing user and send back an update message -SJH
    usersObj[newName].age = newAge;
    response.writeHead(204, { 'Content-Type': 'application/json' });
    response.end();
  } else {
    // Create new user and send success json back -SJH
    const newUser = { name: newName, age: newAge };
    usersObj[newName] = newUser;

    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.write(createdSuccessfully);
    response.end();
  }
};

// Parses the body for post requests - SJH
const handleParsedBody = async (request, response, callback) => {
  const body = [];

  // Storing the data chunks for the body in a body array -SJH
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // Request has finished sending body data -SJH
  await request.on('end', () => {
    // Convert that array into a single string -SJH
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);
    callback(request, response);
  });
};

// Part 1 of adding a new user. Parse the body, passing in part 2 as a callback function -SJH
const addUser = async (request, response) => {
  handleParsedBody(request, response, addUserPt2);
};

module.exports = {
  getUsers,
  getNotFound,
  addUser,
};
