'use strict'

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
	firstname: {type: String, required: true},
	lastName: {type: String, required: true}
  },
  publishDate: {type: String}
});
blogSchema.virtual('ids').get(function(){
  const idObj = this.id.sort((a,b) => {return b.publishDate - a.publishDate});
});
blogSchema.virtual('authorString').get(function(){
	return `${this.author.firstName} ${this.author.lastName}`;
});

blogSchema.methods.serialize = function(){
	return {
		title: this.title,
		content: this.content,
		author: this.authorString,
		created: this.publishDate
	};
}


const BlogPosts = mongoose.model('BlogPosts', blogSchema);

module.exports = {BlogPosts};
