import * as socketIO from 'socket.io'
import * as crypto from 'crypto'
import {Socket, Server, Namespace} from "socket.io";
import {randomBytes} from "crypto";
import Message from './Message';
import {message} from "gulp-typescript/release/utils";

interface MetaData {
  id: string
  online: number
}

let io;
const connectionPool: Array<Client> = [];

export function init(server) {
  console.log('Starting socket.io server');
  io = socketIO.listen(server);
  attachHandlers();
}

function removeFromPool(connection: Client) {
  for (let i = 0; i < connectionPool.length; i++) {
    if (connection.id === connectionPool[i].id) {
      connectionPool.splice(i, 1);
      return;
    }
  }
}

function attachHandlers(): void {
  io.on('connection', (socket: Socket) => {
    const con = new Client(socket, io);
    connectionPool.push(con);

    socket.on('disconnect', () => {
      con.roomMessage(`${con.alias} disconnected`);
      removeFromPool(con);
    })
  });
}

function getRoomMembers(room: string): Array<Client> {
  return connectionPool.filter(sc => sc.room === room);
}

export function generateRoomID() {
  return randomBytes(4).toString('hex');
}

class Client {
  private io: Server;
  private socket: Socket;
  private nick: string = '';
  readonly id = 'u' + crypto.randomBytes(4).toString('hex');
  room: string = "";

  get alias(): string {
    return (this.nick != '' ? this.nick : this.id)
  }

  set alias(alias: string) {
    this.nick = alias;
  }

  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
    this.init();
  }

  init() {
    this.socket.on('room', this.joinRoom.bind(this));
    this.socket.on('message', this.handleMessage.bind(this));
    this.socket.on('nick', this.changeAlias.bind(this));
  }

  changeAlias(alias) {
    if (!alias) {
      return this.clientMessage('Nickname missing');
    }
    this.roomMessage(`${this.alias} changed nickname to ${alias}`);
    this.alias = alias;
  }

  joinRoom(data) {
    this.room = data.room;
    this.socket.join(this.room);
    this.socket.emit('meta', { connections: getRoomMembers(this.room).length });
    this.roomMessage(`${this.alias} connected`)
  }

  roomMessage(message: string) {
    const messageObject = new Message({ message });
    messageObject.setAuthor(`room`);
    messageObject.validate();

    this.sendMessage(messageObject)
  }

  clientMessage(message: string) {
    const messageObject = new Message({ message });
    messageObject.setAuthor(`room`);
    messageObject.validate();

    this.sendMessage(messageObject)
  }

  private handleMessage(socketData, author = this.alias) {
    if (this.room !== "") {
      const message = new Message(socketData);
      message.setAuthor(author);
      message.validate();
      this.sendMessage(message)
    }
  }

  private sendMessage(message: Message, scoketMessage: boolean = false) {
    type Recipient = Socket | Namespace;
    if (message.valid) {
      let recipient: Recipient = this.socket;
      if (scoketMessage) {
        recipient = this.socket;
      } else {
        recipient = this.io.to(this.room);
      }

      recipient.send(message.render());
    }
  }
}