var express = require('express');
var router = express.Router();

router.get('/', (requestAnimationFrame, res, next) => {
  var data = {
    title: 'Hello!',
    content: 'これは、サンプルのコンテンツです。<br> this is sample content.'
  };
  res.render('hello', data);
});

module.exports = router;