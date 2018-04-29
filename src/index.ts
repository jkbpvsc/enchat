import * as express from 'express'
import * as morgan from 'morgan'
import { createServer } from 'http'

import indexRouter from './router/index'
import * as SocketIOServer from './socket/SocketIOServer';

const PORT = process.env.PORT || 80;

const app = express();
const server = createServer(app);
SocketIOServer.init(server);

app.use(express.static('public'));

app.use('/', indexRouter);
app.set('view engine', 'pug');
app.use(morgan('dev'));

app.set('port', PORT);

server.listen(app.get('port'), () => console.log('App running on port: ' + PORT));
