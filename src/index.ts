import * as express from 'express'
import * as morgan from 'morgan'
import { createServer } from 'http'

import indexRouter from './router/index'
import * as SocketIOServer from './socket/SocketIOServer';

const app = express();
const server = createServer(app);
SocketIOServer.init(server);

app.use(express.static('public'));

app.use('/', indexRouter);
app.set('view engine', 'pug');
app.use(morgan('dev'));
app.set('port', 3000);


server.listen(app.get('port'));
//app.listen(3000, () => console.log('App running'));

