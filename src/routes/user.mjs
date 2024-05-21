'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('user/index');
});

export default router;
