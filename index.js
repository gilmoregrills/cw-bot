var fs = require("fs");
var Discord = require("discord.js");
var bot = new Discord.Client();
var keys = require("./keys.json");
var triggers = require("./triggers.json");

var botKey = keys.discord;
bot.login(botKey)
	.then(console.log("logged in with: "+botKey))
	.catch(console.error);

bot.on("ready", botRdy => {
	console.log("bot is ready to go!")
});

var greetings = ["hello", "hi", "ahoy", "hey", "greetings", "yo", "bonjour"];

bot.on("message", msg => {
	if (msg.isMentioned(bot.user)) {
		console.log("message is: \n"+msg.content);
		if (greetings.toString().includes(msg.content.substring(22))) {
			console.log("preparing to greet "+msg.author.username);
			msg.reply("hi there!! ^^")
				.then(msg => console.log(`Sent a reply to ${msg.author.username}`))
				.catch(console.error);
		} else if (msg.content.includes("i" && "cool")) {
			console.log("preparing to see if this user is cool");
			//evaluate if that user is cool
			user = msg.author;
			var responseNo = Math.round(Math.random());
			if (responseNo == 0) {
				msg.reply("right now i'm afraid not, sorry :(")
					.then(msg => console.log(`Sent a reply to ${msg.author.username}`))
					.catch(console.error);
			} else {
				msg.reply("you are!! so cool <3")
					.then(msg => console.log(`Sent a reply to ${msg.author.username}`))
					.catch(console.error);
			}
		} else if (msg.content.includes("@" && "cool")) {
			console.log("preparing to check if another user is cool");
			user = msg.mentions.users.first();
			var responseNo = Math.round(Math.random());
			if (responseNo == 0) {
				msg.reply("i'm sorry to say that "+user+" is not cool :/")
					.then(msg => console.log(`Sent a reply to ${msg.author.username}`))
					.catch(console.error);
			} else {
				msg.reply("omg yes "+user+" is SO cool ^^")
					.then(msg => console.log(`Sent a reply to ${msg.author.username}`))
					.catch(console.error);
			}
		} else if (msg.content.includes("react")) {
			console.log("Reacting!");
			msg.react(bot.emojis.random())
				.then(msg => console.log(`Reacted to ${msg.content}`))
				.catch(console.error);
		} else if (msg.content.includes("warn")) {
			console.log("logging content warning request for "+msg.content.substring(27));
			//var word = parse the message to find the word alone
			addTrigger(msg.content.substring(27), msg.author.username);
			fs.writeFile("triggers.json", JSON.stringify(triggers), (err) => {
				if (err) throw (err);
				console.log("JSON updated!");
			});
			msg.reply("keyword added, I'll keep an eye out!")
				.then(msg => console.log(`Sent a reply to ${msg.author.username}`))
				.catch(console.error);
		} else {
			console.log("received a message i didn't understand");
			//msg.reply("i'm not clever enough to understand that yet :( if you think I should be smarter maybe go yell at robin")
			//	.then(msg => console.log(`Sent a reply to ${msg.author}`))
			//	.catch(console.error);
		}
	} //if mentioned
	else if (checkTriggers(msg.content) != "none" && msg.author.username != "rob-bot" && msg.channel.type != "dm") {
		console.log("preparing content warning");
		var trigger = checkTriggers(msg.content);
		var usersToWarn = new Array();
		console.log("checking whose trigger this is from: "+triggers);
		for (var user in triggers) {
			console.log("name = "+user+" value = "+triggers[user]+"\ntype test: "+typeof user);
			if (triggers[user].includes(trigger)) {
				usersToWarn.push(user);
			}
		}
		console.log("warning the following users: "+usersToWarn);
		for (var j = 1; j < usersToWarn.length; j++) {
			console.log(usersToWarn[j]);
			bot.users.find("username", usersToWarn[j]).sendMessage("content warning for "+trigger+" in channel "+msg.channel.name)
				.then(console.log("sending content warning"))
				.catch(console.error);
			
		}

	}
});

function addTrigger(trigger, username) {
	triggers.all.push(trigger);
	if (triggers.hasOwnProperty(username)) {
		//add trigger to array where key == username
		triggers[username].push(trigger);
	} else {
		triggers[username] = [trigger];
	}
}

function checkTriggers(message) {
	for (var i = 0; i < triggers.all.length; i++) {
		var trigger = triggers.all[i];
		if (message.includes(trigger)) {
			return trigger;
			//return the trigger and break off
		}
	}
	return "none"; 
}

exports.bot = bot;
