'use strict';

import express from 'express';
const router = express.Router();

const qrs = {};

router.get('/:code', (req, res) => {
  const code = req.params.code;
  if (!qrs[code]) {
    res.render('error/403');
    return;
  }
  res.redirect(qrs[code]);
  delete qrs[code];
});

router.post('/', (req, res) => {
  const code = qrKey();
  qrs[code] = req.body.url;
  res.send(JSON.stringify({ code: code }));
});

function qrKey() {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default router;
