'use strict';

import express from 'express';
const router = express.Router();

router.get('*', (req, res, next) => {
  if (!req.cookies.booth) {
    res.redirect(`/`);
    return;
  }

  next();
});

router.get('/', (req, res) => {
  res.redirect('/dash/booth');
});

router.get('/booth', (req, res) => {
  res.render('dash/index', {
    panel: 'booth/booth-index',
    title: '부스 관리',
  });
});

router.get('/menu', (req, res) => {
  res.render('dash/index', {
    panel: 'menu/menu-index',
    title: '메뉴 관리',
  });
});

router.get('/table', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-index',
    title: '테이블 관리',
  });
});

router.get('/table/manage', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-manage',
    title: '테이블 관리',
  });
});

router.get('/table/:tid', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-table',
    title: '테이블 관리',
  });
});

router.get('/table/:tid/history', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-history',
    title: '테이블 관리',
    table: req.params.tid,
  });
});

router.get('/table/:tid/qr', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-qr',
    title: '테이블 관리',
  });
});

router.get('/table/:tid/pay', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-pay',
    title: '테이블 관리',
  });
});

router.get('/table/:tid/done', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-done',
    title: '결제 완료',
  });
});

router.get('/order', (req, res) => {
  res.render('dash/index', {
    panel: 'history/history-index',
    title: '주문 현황',
  });
});

router.get('/history', (req, res) => {
  res.render('dash/index', {
    panel: 'order/order-index',
    title: '주문 기록',
  });
});

export default router;
