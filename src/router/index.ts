import { Router } from 'express'

import { generateRoomID } from "../socket/SocketIOServer";

const router = Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/create', (req, res) => {
  console.log('Creating a new chat room');
  res.redirect(`/${generateRoomID()}`);
});

router.get('/:room', function (req, res) {
  res.render('room')
});

export default router