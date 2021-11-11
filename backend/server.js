const express = require('express');
const path = require('path');
const morgan = require('morgan');
var session = require('express-session')
const fs = require('fs');
const db = require("./db.js")
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
var bcrypt = require('bcrypt');
const cors = require('cors');

mongoose.set('useFindAndModify', false);

app.use(cors());
app.use(session({secret: 'secret',saveUninitialized: true,resave: true}));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('dev'));


app.post('/login', async (req, res)=>{
    username = req.body.username;
    pass = req.body.pass;
    
    try{
      const user = await User.findOne({'username': username}).exec(); 
        if (user){
            const validPass = await bcrypt.compare(pass, user.password);

            if(validPass){
                req.session.userid = user._id;
                req.session.username = user.username;
                req.session.firstname = user.firstname;
                req.session.secondname = user.secondname;
                res.json(user);
            } else {
                res.send(JSON.stringify("Incorrect Password"));
            }
        }
      }catch{error => console.log(error);
     res.send(JSON.stringify("Error: User not found"));
    }
})

app.post('/register', async (req, res)=>{
    try{
      firstname = req.body.firstname;
      secondname = req.body.secondname;
      username = req.body.username;
      cpass = req.body.cpass;
      pass = req.body.pass;

      const hash = await bcrypt.hash(pass, 10);
      const user = new User({
      firstname: firstname,
      secondname: secondname,
      username: username,  
      password: hash
     })
     await user.save().then(result =>{
         console.log(result);
         res.json(result);
     }).catch(err => console.log(err));
    }
    catch{(err => console.log(err))}
  })

app.get('/signout', (req, res)=>{
    
    req.session.destroy();
    res.redirect("/");
})

app.get('/users', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/users.html'));
})

app.delete('/users', (req, res)=>{
      db.deleteUser(req.session.userid);
      res.redirect("/signout");
  })

app.put('/users', (req, res)=>{
    try{
      newName = req.body.name;
      newPass = req.body.pass;
      newEmail = req.body.email;
      db.updateUser(req.session.userid, newName, newEmail, newPass)
      
      req.session.name = newName;
      req.session.email = newEmail;
      req.session.password = newPass;
      res.send(JSON.stringify("Succesful"));
      res.redirect("/users");

    }catch{(err => console.log(err))}
  })

app.get('/home', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/home.html'));
})

app.get('/songs', (req, res)=>{
   filenames = fs.readdirSync('public/assets/music');
   res.send(filenames);   
   console.log(filenames);
})

app.get('/userinfo', (req, res)=>{
    sid = req.session.userid;
    sname = req.session.name;
    semail = req.session.email;
    spass = req.session.password;
    res.send(JSON.stringify({"id": sid, "name":sname, "email":semail, "password":spass}));
})

app.get('/playlist', (req, res)=>{
    Playlist.find({user_id: req.session.userid}, function (err, playlists) {
        if (err) return console.log(err);
        
        res.send(playlists);
    });
 })
 
app.post('/playlist', (req, res)=>{
    playlistTitle = req.body.title;
    db.addPlaylist(req.session.userid, playlistTitle);
    res.send("playlist saved");
})

app.put('/playlist', (req, res)=>{
    putSongs = req.body.songs;
    db.updatePlaylist(req.session.userid, "favorites", putSongs)
    res.send("songs saved to playlist");
})

app.get("/playlistsongs", (req, res)=>{
    strSongs = [];
    Playlist.findOne({user_id: req.session.userid, title: "favorites"}, function (err, playlist) {
        if (err) return console.log(err);
        console.log(playlist.songs);
        playlist.songs.forEach(x=>{
            strSongs.push(x);
        })
        console.log(strSongs);

        res.send(strSongs);
})
})

/*
app.get('/api/sum/:n1/:n2', (req, res)=>{
    
    n1 =(parseInt(req.params.n1));
    n2 =(parseInt(req.params.n1));
    r = n1 + n2;
    res.send(`the sum of ${n1} + ${n2} = ` + JSON.stringify(r));
    //res.send(JSON.stringify());
});*/


const PORT = process.env.PORT || 3000
/*
app.listen(PORT, ()=>{
    console.log('Listening on port ' + PORT + '...')
});*/

//const dbURI = "mongodb://user:admin@cluster0-shard-00-00.e0sy3.mongodb.net:27017,cluster0-shard-00-01.e0sy3.mongodb.net:27017,cluster0-shard-00-02.e0sy3.mongodb.net:27017/MangaReader?ssl=true&replicaSet=atlas-42ce5x-shard-0&authSource=admin&retryWrites=true&w=majority"
const dbURI = "mongodb+srv://user:admin@cluster0.e0sy3.mongodb.net/MangaReader?retryWrites=true&w=majority"

mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(result => {
    console.log("connected to db");
    app.listen(PORT);
})
.catch((err) => console.log(err));