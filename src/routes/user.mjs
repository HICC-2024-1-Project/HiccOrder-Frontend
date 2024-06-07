'use strict';

import express from 'express';
const router = express.Router();

// 세션 체크
router.get('*', (req, res, next) => {});

router.get('/', (req, res) => {
  res.render('user/index');
});

export default router;
