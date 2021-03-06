const chai = require('chai');
const chaiHttp = require('chai-Http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);


describe('Blog post', function(){

	before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
	});

	it('should grab items on GET', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				expect(res).to.be.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				expect(res.body.length).to.be.at.least(1);
				const requried_field = ['title', 'content', 'author'];
				res.body.forEach(function(element){
					expect(element).to.be.a('object');
					expect(element).to.include.keys(requried_field);
				})
			});
	});

	it('should create new post on POST', function(){
		const test_entry = {title: 'just my day', content: 'Jackpot', author: 'anonymous'};
		return chai.request(app)
			.post('/blog-posts')
			.send(test_entry)
			.then(function(res){
				expect(res).to.be.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('title', 'content', 'author', 'id', 'publishDate');
				expect(res.body.id).to.not.equal(null);
				expect(res.body).to.deep.equal(Object.assign(test_entry, {id: res.body.id, publishDate: res.body.publishDate}))
			});
	});

	it('should update pre-existing blog post with PUT', function(){
		const test_entry = {
			title: 'fozz', 
			content: 'bozz', 
			author: 'bizzhizz'
		};
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				test_entry.publishDate = res.body[0].publishDate;
				test_entry.id = res.body[0].id;
				return chai.request(app)
					.put(`/blog-posts/${test_entry.id}`)
					.send(test_entry);
			})
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.deep.equal(test_entry);
			})
	});

	it('should delete an entry with DELETE', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				return chai.request(app)
					.delete(`/blog-posts/${res.body[0].id}`);
			})
			.then(function(res){
				expect(res).to.be.status(204);
			});
	})
});