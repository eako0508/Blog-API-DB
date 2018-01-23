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


});