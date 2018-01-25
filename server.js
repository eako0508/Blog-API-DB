const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { BlogPosts } = require('./models');

const app = express();
app.use(morgan('common'));
app.use(bodyParser.json());

//app.use('/blog-posts', blogRouter);

app.get('/blog-posts', (req,res) =>{
  BlogPosts
    .find()
    .limit(10)
    .then(blogs => {
      res.json(blogs);
    })
    .catch(err=>{
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

app.get('/blog-posts/:id', (req,res)=>{
  BlogPosts
    .findById(req.params.id)
    .then(blogs => res.json(blogs))
    .catch(err=>{
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

app.put('/blog-posts/:id', (req,res)=>{
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message}); 
  }
  
  const updatedEntry = {};
  const updateFields = ['title', 'content', 'author', 'publishDate'];
  updateFields.forEach(field =>{
    if(field in req.body){
      updatedEntry[field] = req.body[field];
    }
  });
  BlogPosts
    .findByIdAndUpdate(req.params.id, {$set: updatedEntry})
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err =>{
      if(err){
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      }).on('error', err => {
        mongoose.disconnect();
        reject(err)
      });  
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(()=>{
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};