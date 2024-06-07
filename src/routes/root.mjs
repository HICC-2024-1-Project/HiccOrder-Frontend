'use strict';

import express from 'express';
const router = express.Router();

import dashRouter from './dash.mjs';
router.use('/dash', dashRouter);

import authRouter from './auth.mjs';
router.use('/auth', authRouter);

import userRouter from './user.mjs';
router.use('/user', userRouter);

export default router;
