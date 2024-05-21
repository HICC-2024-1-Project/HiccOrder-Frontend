'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('dashboard/index', { panel: 'menu' });
});

router.get('/booth', (req, res) => {
  res.render('dashboard/index', { panel: 'booth' });
});

router.get('/menu', (req, res) => {
  res.render('dashboard/index', { panel: 'menu' });
});

router.get('/tables', (req, res) => {
  res.render('dashboard/index', { panel: 'tables/index' });
});

router.get('/tables/:tableid', (req, res) => {
  res.render('dashboard/index', { panel: 'tables/table' });
});

export default router;
