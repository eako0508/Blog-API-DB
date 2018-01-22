const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');

//title, content, an author name, and (optionally) a publication date
/*
GET and POST requests should go to /blog-posts.
DELETE and PUT requests should go to /blog-posts/:id.
Use Express router and modularize routes to /blog-posts.
Add a couple of blog posts on server load so you'll automatically have
some data to look at when the server starts.
 */
//get all info
router.get('/', (req,res)=>{
  res.json(BlogPosts.get());
});

//post
router.post('/blog-posts', jsonParser, (req,res) => {
  const req_param = ['title', 'content', 'author', 'date'];
  for(let i=0;i<req_param.length;i++){
      const req_elem = req_param[i];
      if(!(req_elem in req.body)){
          const msg = `Required field ${req_elem} is not present.`;
          console.error(msg);
          res.status(401).end(); 
      }
  }
  const result = BlogPosts.create(
      req.body.title,
      req.body.content,
      req.body.author,
      req.body.date
  );
  res.status(201).json(result);
});
//update
router.put('/blog-posts/:id', jsonParser, (req,res) => {
    const req_param = ['title', 'content', 'author', 'date'];
    for(let i=0;i<req_param.length;i++){
        const req_elem = req_param[i];
        if(!(req_elem in req.body)){
            const msg = `Required field ${req_elem} is missing.`;
            console.error(msg);
            res.status(401).send(msg); 
        }
    }

    if(req.param.id !== req.body.id){
        const msg = 'id is not matching.';
        console.error(msg);
        res.status(401).send(msg);
    }

    const result = BlogPosts.update(req.body);
    res.status(204).end();
});



//delete
router.delete('/blog-posts/:id', jsonParser, (req,res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog ${req.params.id}.`);
    res.status(204).end();
});

module.exports = router;