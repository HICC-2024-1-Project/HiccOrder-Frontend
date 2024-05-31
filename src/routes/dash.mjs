'use strict';

import express from 'express';
const router = express.Router();

router.get('/booth', (req, res) => {
  res.render('dashboard/index', { panel: 'booth/index' });
});

router.get('/menu', (req, res) => {
  res.render('dashboard/index', { panel: 'menu/index' });
});

export default router;
