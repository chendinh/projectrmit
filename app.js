//import libraries
var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
const cors = require('cors');
var app = express();
var router = express.Router();
app.use(cors());
var jsonParser = bodyParser.json();

//you need to update wp with your own database name
var db = monk('mongodb://admin:nth200486@ds255282.mlab.com:55282/shoppingonline'); //connect to database

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());

//create neccessary objects

//use objects in app

//app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  req.db = db;
  next();
});

//client side routing
app.set('views', __dirname + '/views');

app.get('/home', function (req, res) {
  res.render('home.ejs');
});

//serber side routing
app.use('/', router);

// posts
router.get('/posts', function (req, res) {
  req.db.collection('posts').find({}, {
    "limit": 100
  }, function (err, docs) {
    res.json(docs);
  });
});
router.get('/posts/:id', function (req, res) {
  req.db.collection('posts').findOne({
    _id: req.params.id
  }, function (err, docs) {
    res.json(docs);
  })
});
router.delete('/posts/:id', function (req, res) {
  req.db.collection('posts').remove({
    _id: req.params.id
  }, function (e, docs) {
    res.json(docs);
  })
});
router.post('/posts', function (req, res) {
  req.db.collection('posts').insert(req.body, function (e, docs) {
    res.json(docs);
  });
});
router.post('/posts/getown', jsonParser, function (req, res) {
  var body = req.body;
  var username = body.username;
  req.db.collection('posts').find({
    username: username
  }, function (err, docs) {
    if (err) {
      res.json("Can not get post's information with this username");
    } else {
      res.json(docs);
      console.log("username in this post is:", username);
      console.log("owner post is:", docs);
      console.log("req in server is : ", req.body)
    }
  });
});
router.put('/posts/:id', function (req, res) {
  req.db.collection('posts').findOneAndUpdate({
    _id: req.params.id
  }, req.body, function (err, docs) {
    res.json(docs);
  })
});
// projects
router.get('/projects', function (req, res) {
  req.db.collection('projects').find({}, {
    "limit": 100
  }, function (err, docs) {
    res.json(docs);
    console.log('we connect to this get all project api !');
  });
});
router.get('/projects/:id', function (req, res) {
  req.db.collection('projects').findOne({
    _id: req.params.id
  }, function (err, docs) {
    res.json(docs);
  });
});

router.delete('/projects/:id', function (req, res) {
  req.db.collection('projects').remove({
    _id: req.params.id
  }, function (e, docs) {
    res.json(docs);
  });
});
router.post('/projects', function (req, res) {
  req.db.collection('projects').insert(req.body, function (e, docs) {
    res.json(docs);
  });
});
router.post('/projects/getown', jsonParser, function (req, res) {
  var body = req.body;
  var username = body.username;
  req.db.collection('projects').find({
    username: username
  }, function (err, docs) {
    if (err) {
      res.json("Can not get project's information with this username");
    } else {
      res.json(docs);
      console.log("username project is:", username);
      console.log("owner project is:", docs);
      console.log("req in server is : ", req.body)
    }
  });
});
router.put('/projects/:id', function (req, res) {
  req.db.collection('projects').findOneAndUpdate({
    _id: req.params.id
  }, req.body, function (err, docs) {
    res.json(docs);
  });
});

//register
router.get('/registers', function (req, res) {
  req.db.collection('registers').find({}, {
    "limit": 100
  }, function (err, docs) {
    res.json(docs);
  });
});
router.get('/registers', jsonParser, function (req, res) {
  req.db.collection('registers').findOne({}).toArray(function (err, docs) {
    if (err) {
      res.json("Can not get registers");
    } else {
      res.json(docs);
    }
  });
});
router.delete('/registers/:id', function (req, res) {
  req.db.collection('registers').remove({
    _id: req.params.id
  }, function (err, docs) {
    res.json(docs);
  });
});
router.post('/registers', function (req, res) {
  req.db.collection('registers').insert(req.body, function (err, docs) {
    if (err) {
      res.json('We can not insert new register !');
    } else {
      res.json(docs);
    }
  });
});
router.post('/registers/login', function (req, res) {
  var username = req.body.username
  req.db.collection('registers').findOne({
    username: username
  }, function (err, docs) {
    if (err) {
      res.json("Can not get register's information with this username");
    } else {
      res.json(docs);
    }
  });
});
router.put('/registers/:id', function (req, res) {
  req.db.collection('registers').findOneAndUpdate({
    _id: req.params.id
  }, req.body, function (err, docs) {
    res.json(docs);
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
  // eslint-disable-line no-console
});

module.exports = app;