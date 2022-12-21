var express = require('express');
var router = express.Router();
const mongojs = require("mongojs");
const db2 = mongojs('mongodb://127.0.0.1:27017/usersdb', ['users'])
//var expressValidator = require('express-validator');


/* GET home page. */
router.get('/' , function(req, res, next) {
  res.redirect('/login')
});

//Main interfazera joan logeatua badago     EZ DU BALDINTZA EGITEN********
router.get('/main' , function(req, res, next) {
  console.log(req.session.userId)
  if(req.session.userId){
  res.render('main');
  }else{
    res.redirect('/login')
  }
});


router.post('/user', function(req, res, next) {
  ezduBilatu=true; 
  db2.users.find({username:req.body.username,password:req.body.password},{_id:0},(err, docs) => {
     if (err) {
      res.send('Invalid username or password');
    } else { 
      docs.forEach((doc) => {
        if (doc.username == req.body.username && doc.password == req.body.password && doc.rol == "admin") {
          req.session.userid = req.body.izena 
          console.log("Berdinak dira") 
          res.redirect('/main')
          console.log('Zergaitik ez da joannn?') 
          ezduBilatu=false;
        }
      })
      if(ezduBilatu){ 
        res.render('login') 
      }
    }
    
  })
  });





router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/user', function(req, res, next) {
  console.log("user")
  console.log(req.session.userId)
  if (req.session.userId){
    console.log("joan da")
  res.render('main')
  }else{
    res.redirect('/')
  }
});




router.get('/logout',(req,res) => {//logout programatu.
  req.session.destroy();
  res.render('login');
});

module.exports = router;
/**
var express = require('express');
var router = express.Router();



router.get('/protected',(req,res,next) => {
  //console.log(req.session.userid)
  if(req.session.userid){//lehenngo gauza galdetuko du saio bat dagoen.Cookia ezabatzen bada honek ez dizu utziko orrian sartzen ez daki zein zaren eta.
    //res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    res.send("ok")
    res.render('main')
  }else
    res.redirect('/form.html')//ez badaki zein garen formulariora itzuli.
});

router.get('/logout',(req,res,next) => {//logout programatu.
  req.session.destroy();
  res.redirect('/form.html');
});

module.exports = router;

*/