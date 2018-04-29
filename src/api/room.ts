import { generateRoomID } from '../socket/SocketIOServer';

export const createRoom = (req, res) =>  res.redirect(`/r/${generateRoomID()}`);