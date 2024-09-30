const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Define what to do when this server recieves a request (what response it sends).
// This code executes on the server, response is sent to the client. -SJH
const onRequest = (request, response) => {
  // Index page -SJH
  if (request.url === '/') {
    htmlHandler.getIndex(request, response);
  } else if (request.url === '/style.css') { // Css data -SJH
    htmlHandler.getCss(request, response);
  } else if (request.url === '/getUsers') { // All Json or head responses below. -SJH
    jsonHandler.getUsers(request, response);
  } else if (request.url === '/addUser') {
    jsonHandler.addUser(request, response);
  } else if (request.url === '/notReal') {
    jsonHandler.getNotFound(request, response);
  } else {
    jsonHandler.getNotFound(request, response);
  }
};

// Starting the server, specifying the port, and creating a callback function once it's running -SJH
http.createServer(onRequest).listen(port, () => {
});
