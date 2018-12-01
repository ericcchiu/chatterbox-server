/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


var url = require('url');

var data = {results: [{username: 'Pikachu', text: 'PIKA PIKA PIKA', objectId: 0}]};

var defaultCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, X-Parse-Application-Id, X-Parse-REST-API-Key, accept',
  'Access-Control-Max-Age': 10 // Seconds.
};
var id = 1; 


var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  // response.writeHead(statusCode, headers);

  // GET Request Handlers 
  if ((url.parse(request.url).pathname === '/classes/messages' || url.parse(request.url).pathname === '/') && request.method === 'GET') { 
    // On success send a stringified data 
    response.writeHead(200, headers);
    console.log(data);
    response.end(JSON.stringify(data));
    
  } else if (url.parse(request.url).pathname === '/classes/messages' && request.method === 'POST') {
    let body = [];
    request.on('error', (err)=> {
      console.log('Big ol Error', err);
    }).on('data', (chunk) => { 
      body.push(chunk);
      // console.log('THIS IS OUR CHUNK FROM POST' + chunk);   
    }).on('end', () => { 
      
      body = Buffer.concat(body);
      body = body.toString('utf-8');


      console.log('hello');
      console.log("############: "+body+"###########");
      var messagePost = JSON.parse(body); 
      console.log('MESSAGEPOST: '+messagePost);
      
      messagePost.objectId = id; 
      console.log("THIS IS OBJECTID: "+JSON.stringify(messagePost));
      id++; 
      data.results.push(messagePost);
      console.log('DATADATADATA: ' + JSON.stringify(data.results));
      
      
      
      // console.log('DATADATA: ' + JSON.stringify(data));
      response.writeHead(201, headers);
      response.end(JSON.stringify(data.results)); //JSON.stringify(body)
    });
     
  } else if (request.method === 'OPTIONS') { 
    response.writeHead(200, headers);
    response.end('Hello, World!');

  } else {

    response.writeHead(404, headers);
    response.end('Better luck next time!');
  } 
    
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve your chat
// client from this domain by setting up static file serving.


module.exports.requestHandler = requestHandler; 

