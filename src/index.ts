import * as express from 'express'
import * as morgan from 'morgan'
import { createServer } from 'http'

import indexRouter from './router/index'
import * as SocketIOServer from './socket/SocketIOServer';

function startServer() {
  const PORT = process.env.PORT || 5000;
  const app = express();
  const server = createServer(app);

  console.log(`Starting server on port ${PORT}`);

  SocketIOServer.init(server);
  app.use(express.static('public'));

  app.use('/', indexRouter);
  app.set('view engine', 'pug');
  app.use(morgan('dev'));

  app.set('port', PORT);
  server.listen(PORT, () => console.log('Server running on port: ' + PORT));
}

startServer();