import { Router } from 'express'

import { roomPage, indexPage } from "../api/render";
import { createRoom } from "../api/room";

const router = Router();

router.get('/', indexPage);

router.get('/r', createRoom);

router.get('/r/:room', roomPage);

export default router