import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {  acceptFriendRequest, friendRequest, getFrndsReqs, myFrnds, outGoingReqs, recommendFrnds } from '../controllers/user.controller.js';

const router = express.Router();

router.use(protectRoute);

router.get('/',recommendFrnds);
router.get('/frnds',myFrnds);

router.post('/frnd-req/:id', friendRequest);
router.put('/frnd-req/:id/accept', acceptFriendRequest);

router.get('/frnd-reqs', getFrndsReqs);
router.get('/outgoing-frnd-reqs',outGoingReqs);

export default router;