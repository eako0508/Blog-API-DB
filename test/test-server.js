const chai = require('chai');
const chaiHttp = require('chai-Http');

const expect = chai.expect;

chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');

describe('Blog post', function(){

	before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
	});

	it('should grab items on GET', function(res){
		return chai.request(app)
			.get('/blog-post')
			.then(function(res){
				expect(res).to.be.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				//expect(res.body).to.include('title', 'content', 'author');
				expect(res.body.length).to.be.at.least(1);
			});
	});


});