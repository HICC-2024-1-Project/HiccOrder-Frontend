'use strict';

import express from 'express';
const router = express.Router();

router.get('/menu', (req, res) => {
  res.render('dashboard/index', { panel: 'menu' });
});

export default router;
