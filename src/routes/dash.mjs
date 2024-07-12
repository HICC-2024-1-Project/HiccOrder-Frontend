'use strict';

import express from 'express';
const router = express.Router();

router.get('/booth', (req, res) => {
  res.render('dash/index', {
    panel: 'booth/index',
    title: '부스 관리',
  });
});

router.get('/menu', (req, res) => {
  res.render('dash/index', {
    panel: 'menu/index',
    title: '메뉴 관리',
  });
});

router.get('/table/', (req, res) => {
  res.render('dash/index', {
    panel: 'table/index',
    title: '테이블 관리',
  });
});

router.get('/table/manage', (req, res) => {
  res.render('dash/index', {
    panel: 'table/manage',
    title: '테이블 관리',
  });
});

router.get('/table/:tid', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table',
    title: '테이블 관리',
  });
});

router.get('/table/:tid/order', (req, res) => {
  res.render('dash/index', { panel: 'table/table-order' });
});

router.get('/table/:tid/qr', (req, res) => {
  res.render('dash/index', { panel: 'table/table-qr' });
});

router.get('/table/:tid/pay', (req, res) => {
  res.render('dash/index', { panel: 'table/table-pay' });
});

router.get('/order', (req, res) => {
  res.render('dash/index', {
    panel: 'order/index',
    title: '주문 현황',
  });
});

export default router;
