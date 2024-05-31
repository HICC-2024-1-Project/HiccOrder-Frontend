'use strict';

import express from 'express';
const router = express.Router();

router.get('/booth', (req, res) => {
  res.render('dash/index', { panel: 'booth/index' });
});

router.get('/menu', (req, res) => {
  res.render('dash/index', { panel: 'menu/index' });
});

export default router;
