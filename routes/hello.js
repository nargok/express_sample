var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('mydb.sqlite3');

var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'mydb.sqlite3'
  },
  useNullAsDefault: true
});

var Bookshelf = require('bookshelf')(knex);

var MyData = Bookshelf.Model.extend({
  tableName: 'mydata'
});

router.get('/', (req, res, next) => {
  new MyData().fetchAll().then((collection) => {
    var data = {
      title: 'Hello!',
      content: collection.toArray()
    };
    res.render('hello/index', data);
  })
  .catch((err) => {
    res.status(500).json({error: true, data: {message: err.message}});
  });
});

router.get('/add', (req, res, next) => {
  var data = {
    title: 'Hello/add',
    content: '新しいレコードを入力:',
    form: {name: '', mail: '', age: 0}
  }
  res.render('hello/add', data);
})

router.post('/add', (req, res, next) => {
  var response = res;
  new MyData(req.body).save().then((model) => {
    response.redirect('/hello');
  });
});

router.get('/show', (req, res, next) => {
  var id = req.query.id;
  db.serialize(() => {
    var q = 'select * from mydata where id = ?';
    db.get(q, [id], (err, row) => {
      if (!err) {
        var data = {
          title: 'Hello/show',
          content: 'id = ' + id + ' のレコード:',
          mydata: row
        }
        res.render('hello/show', data);
      }
    });
  });
});

router.get('/edit', (req, res, next) => {
  var id = req.query.id;
  db.serialize(() => {
    var q = "select * from mydata where id = ?"
    db.get(q, [id], (err, row) => {
      if (!err) {
        var data = {
          title: 'hello/edit',
          content: 'id = ' + id + 'のレコードを編集:',
          mydata: row
        };
      console.log(data);
      res.render('hello/edit', data);
      }
    });
  });
});

router.post('/edit', (req, res, next) => {
  var id = req.body.id;
  var name = req.body.name;
  var mail = req.body.mail;
  var age = req.body.age;
  var q = "update mydata set name = ?, mail = ?, age = ? where id = ?";
  db.run(q, name, mail, age, id);
  res.redirect('/hello');
});

router.get('/delete', (req, res, next) => {
  var id = req.query.id;
  db.serialize(() => {
    var q = "select * from mydata where id = ?";
    db.get(q, [id], (err, row) => {
      if (!err) {
        var data = {
          title: 'Hello/Delete',
          content: 'id = ' + id + 'のレコードを削除:',
          mydata: row
        };
      }
      res.render('hello/delete', data);
    });
  });
});

router.post('/delete', (req, res, next) => {
  var id = req.body.id;
  var q = "delete from mydata where id = ?";
  db.run(q, id);
  res.redirect('/hello');
});

module.exports = router;