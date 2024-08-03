'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  if (req.cookies.booth) {
    res.redirect(`/dash`);
  } else {
    res.redirect(`/auth`);
  }
});

import dashRouter from './dash.mjs';
router.use('/dash', dashRouter);

import authRouter from './auth.mjs';
router.use('/auth', authRouter);

import userRouter from './user.mjs';
router.use('/user', userRouter);

export default router;
