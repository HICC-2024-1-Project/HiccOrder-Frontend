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

router.get('/menu/create', (req, res) => {
  res.render('dash/index', {
    panel: 'menu/menu-manage',
    title: '<a href="/dash/menu">메뉴 관리</a> / 메뉴 추가',
    mid: '',
  });
});

router.get('/menu/:mid', (req, res) => {
  res.render('dash/index', {
    panel: 'menu/menu-manage',
    title: '<a href="/dash/menu">메뉴 관리</a> / 메뉴 수정',
    mid: req.params.mid, // 캐신기
  });
});

router.get('/table', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-index',
    title: '테이블 관리',
  });
});

router.get('/table/:tid/order', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-order',
    title: '<a href="/dash/table">테이블 관리</a> / 주문 현황',
    table: req.params.tid,
  });
});

router.get('/table/:tid/check', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-check',
    title: '<a href="/dash/table">테이블 관리</a> / 주문 내역 확인',
    table: req.params.tid,
  });
});

router.get('/table/:tid/pay', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-pay',
    title: '<a href="/dash/table">테이블 관리</a> / 결제',
    table: req.params.tid,
  });
});

router.get('/table/:tid/done', (req, res) => {
  res.render('dash/index', {
    panel: 'table/table-done',
    title: '<a href="/dash/table">테이블 관리</a> / 결제 완료',
    table: req.params.tid,
  });
});

router.get('/order', (req, res) => {
  res.render('dash/index', {
    panel: 'order/order-index',
    title: '주문 현황',
  });
});

router.get('/history', (req, res) => {
  res.render('dash/index', {
    panel: 'history/history-index',
    title: '주문 기록',
  });
});

router.get('/order', (req, res) => {
  res.render('dash/index', {
    panel: 'order/order-index',
    title: '주문 현황',
  });
});

export default router;
