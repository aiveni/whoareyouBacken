var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
const mongojs = require("mongojs");
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['players'])
const db2 = mongojs('mongodb://127.0.0.1:27017/usersdb', ['users'])
const session = require('express-session')
const multer  = require('multer')
const fs = require('fs')
var app = express();

//USERNAME: jon
//PASSWORD: pasahitza1 

const sess = {
  secret: 'ausazko hitz multzoa',
  cookie: {maxAge: 1000*60*5},//5 minutu baino ezin da sesioa hasi.
  resave:false,
  saveUninitialized:true
}
app.use(session(sess))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var indexRouter = require('./routes/index');
const playersRouter = require('./routes/players.js');
const axios = require("axios");
const router = require('./routes/index');

const uploadFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if(ext!='.png'){
    cb("null",false);
    console.log("errorrr")//errore 500 atera behar du?
  }else{
    cb(null,true);
    console.log("success")
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images/player/')
  },
  filename: function (req, file, cb) {      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,file.originalname)
  }
})

const upload = multer({ storage: storage, fileFilter: uploadFilter })

/**
var rawdata = fs.readFileSync('fullplayers.json');
var players = JSON.parse(rawdata);
var laligaPlayers = players.filter(player => player.leagueId == 548);
var laligaPlayersTeamId = laligaPlayers.map(player => player.teamId);
var laligaPlayersTeamIdUnique = [...new Set(laligaPlayersTeamId)];
console.log(laligaPlayersTeamIdUnique);
*/

const options = {
  method: 'GET',
  url: 'https://v3.football.api-sports.io/teams?id=548 ',
  headers: {
    'X-RapidAPI-Key': '6b17b8030d90885db478b2a09ed973c6',
    'X-RapidAPI-Host': 'v3.football.api-sports.io'
  }
};
/*
axios.request(options).then(function (response) {
	console.log(response.data.response);
}).catch(function (error) {
	console.error(error);
});*/



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Declarar variables globales errors
app.use (function (req, res, next) {
  res.locals.errors = null;
  next();
});
/*
app.use('/', indexRouter);
app.use('/api/v1/players', playersRouter);
*/
//app.use('/main', indexRouter);


app.use('/', indexRouter);
//app.use('/user', playersRouter);
//app.use('/protected',indexRouter)
app.use('/logout',indexRouter)
app.use('/api/v1/players', playersRouter);

//express validator middeleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



let ezduBilatu=false;
//LOGIN tratatu:


  



//REGISTER tratatu
app.get ('/register', function(req, res, next) {
  res.render('register')
}); 

app.post('/register', function(req, res, next) {
  console.log(req.body)
  req.checkBody('username', 'Username jartzea beharrezkoa da!').notEmpty();
  req.checkBody('password', 'Password jartzea beharrezkoa da!').notEmpty();
  req.checkBody('email', 'Email jartzea beharrezkoa da!').notEmpty();
  req.checkBody('email', 'Emaila ez da zuzena!').isEmail();
  //req.checkBody('password2', 'Passwordak berdinak izan behar dira!').equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
    res.render('register', { 
      errors:errors
    });
  } else {
    var newUser = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      rol: "user"
    }
    db2.users.insert(newUser, function(err, result){
      if(err){
        console.log(err);
      } else {
        console.log('User added...');
        res.redirect('/');
      }
    });
  }
}); 






//Formulariotik datuak jaso jokalari berri bat sortzeko
app.post('/players/add', upload.single('argazkia'), function(req, res) {
  console.log("fds")
console.log(req.file)
console.log("fds")
if(req.file){
  fs.rename('public/images/player/'+req.file.filename, 'public/images/player/'+req.body.item+'.png', function (err) {
    if (err) throw err;
     console.log('renamed complete');
   });
}
   

req.checkBody('item', 'Identifikazioa jartzea beharrezkoa da!').notEmpty();  
req.checkBody('Name', 'Izena jartzea beharrezkoa da!').notEmpty();
req.checkBody('Birthdate', 'Jaiotze data jartzea beharrezkoa da!').notEmpty();
req.checkBody('nationality', 'nationality jartzea beharrezkoa da!').notEmpty();
req.checkBody('teamId', 'teamId jartzea beharrezkoa da!').notEmpty();
req.checkBody('position', 'position jartzea beharrezkoa da!').notEmpty();
req.checkBody('leagueId', 'leagueId jartzea beharrezkoa da!').notEmpty();

var errors = req.validationErrors();
if (errors){
    console.log("Errorea datuak jasotzean");
    console.log(errors)
    res.render('add', {
      errors:errors
    });
  }
  else{
   var newPlayer={
    "id": parseInt( req.body.item),
    "name": req.body.Name,
    "birthdate": req.body.Birthdate,
    "nationality": req.body.nationality,
    "teamId": parseInt( req.body.teamId),
    "position":  req.body.position,
    "leagueId": parseInt( req.body.leagueId),
}
  db.players.insert(newPlayer, function(err, result){
    if(err){
      console.log(err);
    }
    res.render('add', {
      error: 'Jokalaria sortu egin da!'
    })
  }
  );
  }
  console.log(newPlayer)
}

  
);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

