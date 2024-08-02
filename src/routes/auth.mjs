'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('auth/index', {
    title: '힉오더',
    page: 'root',
  });
});

router.get('/login', (req, res) => {
  res.render('auth/index', {
    title: '로그인 - 힉오더',
    page: 'login',
  });
});

router.get('/terms', (req, res) => {
  res.render('auth/index', {
    title: '이용약관 동의 - 힉오더',
    page: 'terms',
  });
});

router.get('/register', (req, res) => {
  res.render('auth/index', {
    title: '계정 등록 - 힉오더',
    page: 'register',
  });
});

router.get('/reset-password', (req, res) => {
  res.render('auth/index', {
    title: '비밀번호 재설정 - 힉오더',
    page: 'reset-password',
  });
});

export default router;
