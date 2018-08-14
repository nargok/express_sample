var express = require('express');
var router = express.Router();

var data = [
  {name: 'Taro', age:35, mail: 'taro@example.com'},
  {name: 'Hanako', age:24, mail: 'hanako@example.com'},
  {name: 'Sachiko', age:18, mail: 'sachiko@example.com'},
];

router.get('/', (req, res, next) => {
  var n = req.query.id;
  res.json(data[n]);
})

module.exports = router;