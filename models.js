'use strict'

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, requried: true},
  publishDate: {type: Date}
});
/*
blogSchema.virtual('ids').get(function(){
  const idObj = this.id.sort((a,b) => {return b.publishDate - a.publishDate});
});
*/
const BlogPosts = mongoose.model('BlogPosts', blogSchema);

module.exports = {BlogPosts}


/*
function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const BlogPosts = {
  create: function(title, content, author, publishDate) {
    
    const post = {
      title: title,
      content: content,
      author: author,
      publishDate: publishDate || Date.now()
    };
    BlogPost.create(post).catch(err =>{
      console.error(err);
      return err;
    });
    return post;
  },
  get: function(id=null) {
    const res = {};
    if (id !== null) {
      BlogPost
       .find()
       .limit(10)
       .then(function(obj){
        res.json(obj);
        return res;
       })
       .catch(err => {
          console.error(err);
          return err;
       });
    }  
  },
  delete: function(id) {
    BlogPost
      .findByIdAndRemove(id)
      .catch(err => {
        console.error(err);
        return err;
      });
  },
  update: function(updatedPost) {

    const {id} = updatedPost;
    BlogPost.findByIdAndUpdate(id, )
    
    const postIndex = this.posts.findIndex(
      post => post.id === updatedPost.id);
    if (postIndex === -1) {
      throw new StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.posts[postIndex] = Object.assign(
      this.posts[postIndex], updatedPost);
    return this.posts[postIndex];
  }
};

function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}
*/


