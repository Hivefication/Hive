var APIeasy = require('api-easy'),
	assert = require('assert');

var suite = APIeasy.describe('Badges api validation');

suite.use('localhost', 8888)
	.discuss('When getting all the badges')
		.get('/badges')
			.expect(200)
			.expect([])
	.undiscuss()
	.next()
	.discuss('When adding a badge')
		.setHeader('Content-Type', 'application/json')
		.post('/badges', { name: 'badge1', icon: './icon/badge1.png' })
			.expect(200)
			.expect('should respond the badge itself', function (err, res, body){
				var badge = JSON.parse(body);
				assert.isNotNull(badge._id);
				assert.equal(badge.name, 'badge1');
				assert.equal(badge.icon, './icon/badge1.png');
				assert.equal(badge.url, '/badges/' + badge._id);
			})
	.undiscuss()
	.next()
	.discuss('When getting all the badges')
		.removeHeader('Content-Type', 'application/json')
		.get('/badges')
			.expect(200)
			.expect('should respond with an array of one badge', function(err, res, body){
				var badges = JSON.parse(body);
				assert.isArray(badges);
				assert.equal(badges.length, 1);
			})
	.export(module);