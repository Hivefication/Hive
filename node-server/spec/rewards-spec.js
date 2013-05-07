var APIeasy = require('api-easy'),
	assert = require('assert');

var suite = APIeasy.describe('Rewards api validation');

suite.use('localhost', 8888)
	.discuss('When adding a reward')
		.setHeader('Content-Type', 'application/json')
		.post('/rewards', { name: 'reward1', score: "100" })
			.expect(200)
			.expect('should respond the reward itself', function (err, res, body){
				var reward = JSON.parse(body);
				assert.isNotNull(reward._id);
				assert.equal(reward.name, 'reward1');
			})
	.undiscuss()
	.next()
	.discuss('When getting all the rewards')
		.removeHeader('Content-Type', 'application/json')
		.get('/rewards')
			.expect(200)
			.expect('should respond with an array of one reward', function(err, res, body){
				var rewards = JSON.parse(body);
				assert.isArray(rewards);
				assert.equal(rewards.length, 1);
			})
	.export(module);