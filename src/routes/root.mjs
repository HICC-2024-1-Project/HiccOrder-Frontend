'use strict';

import express from 'express';
const router = express.Router();

import dashboardRouter from './dashboard.mjs';
router.use('/dashboard', dashboardRouter);

import userRouter from './user.mjs';
router.use('/user', userRouter);

export default router;
