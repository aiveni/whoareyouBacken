var express = require('express');
var router = express.Router();
const mongojs = require("mongojs");
const app = require('../app');
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['players'])
var expressValidator = require('express-validator');


  
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


let remove = function(res, id){
  db.players.remove({id:parseInt(id)}, (err, result) => {
      if (err) {
          res.send(err);
      } else {
        res.render('delete', {
          title: 'Ezabatu egin da jokalaria!'
        });
      }
  });
}
//CRUD ezabatu
router.get('/remove/:ID', function(req, res, next) {
  console.log(req.session.userId)
  if(req.session.userId){
  console.log("getena")
  remove(res, req.params.ID);
  }else{
    res.redirect('/login')
  }
});
 
router.post('/remove/ID', function(req, res, next) {
  remove(res, req.body.id);
  res.render('delete', {
    errors: 'Ezabatu egin da jokalaria!'
  })
});


//CRUD gehitu
router.get('/add', function(req, res, next) {
  res.render('add')
});
router.get('/edit', function(req, res, next) {
  res.render('editId')
});

//recive form of player
router.post('/ID', function(req, res, next) {
  db.players.find({id:parseInt(req.body.id)}, function(err, player) {
    if (err) {
      res.send
    }
    
    res.render('player', {
      title: 'Player',
      player: player,
      image: `${req.body.id}`
    });
  });
});

//CRUD ikusi
router.get('/:ID', function(req, res, next) {
  console.log(req.params)

  db.players.find({id:parseInt(req.params.ID)}, function(err, player) {
    let argazki;
    if(player[0]){
      argazki = player[0].id;
    }
    console.log(argazki)
    if (err) {
      res.send
    }
    res.render('player', {
      title: 'Player',
      player: player,
      image: `${argazki}`
    });
  });
  //res.render('player', { title: 'Player' });
});


router.get('/edit/:id', function(req, res, next) {
  console.log("edit sartu da2")
  db.players.find({id:parseInt(req.params.id)}, function(err, player) {
    console.log(req.params.id)
    console.log(player)
    if (err) {
      res.send
    } 
    console.log(player)
  res.render('edit', {
    id: player[0].id,
    name: player[0].name,
    birthdate: player[0].birthdate,
    nationality: player[0].nationality,
    teamId: player[0].teamId,
    position: player[0].position,
    number: player[0].number,
    leagueId: player[0].leagueId,
    title: 'Edit Player'
  })
})
});

router.use(expressValidator())
router.post('/edit/id', function(req, res, next) {
  //errors
  req.checkBody('id', 'Id is required').notEmpty();

  //get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('editId', {
      errors:errors
    });
  } else {
  //get photo of player 
  let argazki;
  db.players.find({id:parseInt(req.body.id)}, function(err, player) {
    if (err) {
      console.log("no entra")
      }
      if(player[0]==null){
        console.log("no entra")
        res.render('editId', {
          errors:"ez da aurkitu errore hori"
        });
      }
      console.log(player)
      res.render('edit', {
        id: player[0].id,
        name: player[0].name,
        birthdate: player[0].birthdate,
        nationality: player[0].nationality,
        teamId: player[0].teamId,
        position: player[0].position,
        number: player[0].number,
        leagueId: player[0].leagueId,
        title: 'Edit Player'
      })
    })}
  });
        

//CRUD aldatu
router.put('/edit', function(req, res, next) { 
  //recive PUt method from edit.ejs and update the player in the database 
  req.body.id = parseInt(req.body.id)
  req.body.teamId = parseInt(req.body.teamId)
  req.body.number = parseInt(req.body.number)
  req.body.leagueId = parseInt(req.body.leagueId)

  console.log(req.body)
  db.players.update({id:parseInt(req.body.id)}, {$set: {
    id: req.body.id,
    name: req.body.name,
    birthdate: req.body.birthdate,
    nationality: req.body.nationality,
    teamId: req.body.teamId,
    position: req.body.position,
    number: req.body.number,
    leagueId: req.body.leagueId
  }}, (err, result) => {
      if (err) {
          res.send(err);
      } else {
        console.log("apa")
        res.render('edit');
      }
  });
})


module.exports = router;
