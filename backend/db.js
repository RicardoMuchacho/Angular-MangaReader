const mongoose = require('mongoose');
const User = require('./models/user');
var bcrypt = require('bcrypt');
const { modelName } = require('./models/user');

const dbURI = "mongodb+srv://user:admin@cluster0.e0sy3.mongodb.net/MangaReader?retryWrites=true&w=majority"


mongoose.set('useFindAndModify', false);

mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology:true})

async function addUser(firstname, secondname, username, pass){
    const hash = await bcrypt.hash(pass, 10);
    const user = new User({
    firstname: firstname,
    secondname: secondname,
    username: username,
    password: hash
 })
 await user.save().then(result =>{
     console.log(result);
     newuser = JSON.stringify(user)
     console.log(newuser)
     return newuser;
 }).catch(err => console.log(err));
}

//addUser('Rick', 'rr', 'rickster', 'r');


function addPlaylist(user_id, title){
    const playlist = new Playlist({
       user_id: user_id,
       title: title,
       times_followed: 0,
    })
    playlist.save().then(result =>{
        console.log(result);
    }).catch(err => console.log(err));
}

function addSong(title){
    const song = new Song({
       title: title,
       times_played: 0
    })
    song.save().then(result =>{
        console.log(result);
    }).catch(err => console.log(err));
}

async function getUser(username, pass){
    try{
        const user = User.findOne({'username': username}, function (err, user) {
        if(user){
            const validPass = bcrypt.compare(pass, user.password)
            if (validPass){
              console.log("Valid password")
            } else {
              console.log("Error")
            }
        }else{
            console.log("user not found")
        }
        console.log(user);
        //console.log(user.firstname, user.secondname, user.username, user.password, user._id);
        return console.log("Logged in");
    }) 
    } catch (e){
        console.log(e);
    }
}

//getUser("rickster"," rfhtrg" );


function updateUser(userid, name, email, pass){
try{
  update = {
      name: name,
      email: email,
      password: pass
  }
  User.findOneAndUpdate({_id: userid}, update, function (err, user) {
    console.log(user.name, user.email, user.password, user._id);
});
  console.log(update);
}catch{(e => console.log(e))};
}

function deleteUser(userid){
  User.findOneAndDelete({_id: userid }, function (err, user) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted User : ", user);
    }
});
}

function getUserPlaylists(userid){
    titles = [];
    Playlist.find({user_id: userid}, function (err, playlists) {
        if (err) return console.log(err);
        
        playlists.forEach(p => {
            console.log(p.title)
            titles.push(p.title)})
        console.log(titles);
        return titles;
    });
}

function getPlaylistSongs(userid, ptitle){
    
    Playlist.findOne({user_id: userid, title: ptitle}, function (err, playlist) {
        if (err) return console.log(err);
        console.log(playlist.songs);
        return playlist.songs;
    });
}

//songsArr = ["gHOLAAA", "godt7utjick"];
async function updatePlaylist(userid, ptitle, songsArray){

const res = await Playlist.updateOne({user_id:userid,  title:ptitle }, {$push:{ songs: songsArray}});
//console.log(res.n); // Number of documents matched
console.log(res.nModified); // Number of documents modified 
}    

//updatePlaylist("60e3a4c016a6d23f88d4ac87", "playlist5", songsArr)
//getPlaylistSongs("60e3a4c016a6d23f88d4ac87", "playlist5");
//deleteUser("60e511a4763f6814f05084c8");
//updateUser("60e4d43e3f839f32a40c1016", "rrr", " ", " ")
//songArray = ["hola", "gg", "gejrg"];
//addSong("holis");
//addPlaylist("60e3a4c016a6d23f88d4ac87", "playlist5", songArray)
//addUser("rikity", "f@gmail.com", "hh");

module.exports = {updatePlaylist, getPlaylistSongs, getUserPlaylists, deleteUser, updateUser, addUser, addPlaylist, addSong}

/*
function addUser(name, email, pass){
    const user = new User({
        name: name,
        email: email,
        password: pass,
        playlists: [
         {
            title: 'p1', 
            songs: ['hh', 'ff']
         },
        {
            title: 'p2', 
            songs: ['gg', 'bb']}]
     });
    }*/