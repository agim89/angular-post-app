const app = require('./backend_node/app');
const http = require('http');
const debug = require("debug")("node-angular");


const normalizationPort = val => {
  var port = parseInt(val, 10);
    if( isNaN(port)) {
      // named pipe
      return val;
    }
    if(port => 10) {
      // port number
      return port;
    }
    return false;
}

const onError = error => {
  if(error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  switch (error.code){
    case 'EACCES':
      console.log(bind + "requires elevetad priviages");
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw  error;
  }
}
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
}

const port = normalizationPort(process.env.PORT || 3000);
app.set('port', port )

const server = http.createServer(app);
server.on('error', onError);
server.on('listenig', onListening);
server.listen(port);
