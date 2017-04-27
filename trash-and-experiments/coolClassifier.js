var client = require("./index.js");
var math = require("mathjs");
//access the client object through client.bot

//construct training sets by: 
	//creating a list of users to train on
	//creating a list of those users classes
	//creating a 2d array, one col for each channel one row for each training user
	//pulling most recent messages (up to??) from certain channels
	//search those messages for messages where user  = training user
	//for each of those messages +1 to appropriate index in 2d array 
	//2d array + classes array constitute training data

//training users, should be replaced by ids
var trainingUsers = ["Keeyez#7309", "Holli#9288", "gilmoregrills#3990", "Ash#2806", "Aidan#2567"];
//training channel names
var trainingChannels = ["smart_stuff_talk", "the_sex_number", "the_weed_number", "nickchat", "selfies"];
//classes for the above users
var trainingClasses = math.transpose([[0, 1, 1, 0, 1]]);
//these should just be instantiated by later method calls but having the visualisation is nice
var trainingData = [ [0, 0, 0, 0, 0],
		   [0, 0, 0, 0, 0],
		   [0, 0, 0, 0, 0],
		   [0, 0, 0, 0, 0],
		   [0, 0, 0, 0, 0] ];
//list of channel ids to check

function getData() {
	var channels = client.bot.channels
//	console.log(channels);

	console.log("trainingData pre-get: \n");
	console.log(trainingData);
	var channels = channels.filter(function(channel) {
			console.log(channel.name);
			//here lies the ugliest line of code in the world. pls refactor, future-me
			return channel.name === trainingChannels[0] || channel.name === trainingChannels[1] || channel.name === trainingChannels[2] || channel.name === trainingChannels[3] || channel.name === trainingChannels[4]
	});
	console.log(channels);
	console.log(channels.array().length);
	//the channels collection should now just contain channels that I want
	//for each user/row
	for(var j = 0; j < 5; j++) {
		user = trainingUsers[j];
		console.log("getting data for: "+trainingUsers[j]);
		//for each channel/col
		for (var k = 0; k < channels.array().length; k++) {
			console.log("checking channel: "+trainingChannels[k]);
			var channel = channels.find("name", trainingChannels[k]);
			var msgs = channel.fetchMessages({limit: 100})
				.then(function(messages) {
					var m = messages.findAll("author.username", user);
					var num = m.size;
					trainingChannels[j][k] = num;
				})
				.catch(console.error);
		}
	}
	console.log("trainingData post-get: \n");
	console.log(trainingData);
	
}
//what is this bit doing in the python version? 
//make it work properly
function logistic(x, deriv) {
	if (deriv == true) {
//		console.log(math.subtract(x, 1));
		return math.multiply(x, (math.subtract(x, 1)));
	} else {
		return math.divide(1, (math.add(1, math.exp(-x))));
	}
}

function train() {
	//inputs being initialized based on random data currently
	//getData();
	//train ANN on training set
	//classify user based on resulting function/weights
	//trainingClasses and trainingData
	var weights0 = math.matrix(math.random([5, 5])); //needs to be randomly instantiated
	console.log("weights0: \n");
	console.log(weights0);
	var weights1 = math.matrix(math.random([5, 1])); //needs to be randomly instantiated
	console.log("weights1: \n");
	console.log(weights1);

	var input = math.matrix(math.random([5, 5], 30));
	console.log("inputs: ");
	console.log(input);
	var output = math.matrix(trainingClasses);
	console.log("outputs: ");
	console.log(output);

	for (var i = 0; i <= 100; i++) {

		var l0 = input;
		//throwing error at dotMultiply related to size of weights
		var l1 = logistic(math.multiply(l0, weights0), false);
		var l2 = logistic(math.multiply(l1, weights1), false);
	
		var l2Error = math.subtract(output, l2);

		var l2Delta = math.multiply(l2Error, logistic(l2, true));
		var l1Error = math.multiply(l2Delta, math.transpose(weights1));

		var l1Delta = math.multiply(l1Error, logistic(l1, true));
		
		weights1 = math.add(weights1, math.dotMultiply(l1, l2Delta));
		weights0 = math.add(weights0, math.transpose(math.dotMultiply(l0, l1Delta)));
	}
	console.log("output after training:");
	console.log(l2);
}

exports.train = train;
