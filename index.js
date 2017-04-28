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

//a test to see if the bot is working on the server
var greetings = ["hello", "hi", "ahoy", "hey", "greetings", "yo", "bonjour"];

/**
 * on every message sent on a server where this bot is present
 */
bot.on("message", msg => {
	//if the bot is @ mentioned, the message is a command and this conditional block is run
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
		} else if (msg.content.includes("safe")) {
			console.log("the coast is clear for: "+msg.content.substring(27));
			var trigger = checkTriggers(msg.content);
			var usersToNotify = new Array();
			for (var user in triggers) {
				if (triggers[user].includes(trigger)) {
					usersToNotify.push(user);
				}
			}
			console.log("sounding the all-clear to the following users: "+usersToNotify);
			for (var j = 1; j < usersToNotify.length; j++) {
				bot.users.find("username", usersToNotify[j]).sendMessage("they've sounded the all-clear for "+trigger+" in channel "+msg.channel.name)
					.then(console.log("sending all-clear"))
					.catch(console.error);
			}
		} else {
			console.log("received a message i didn't understand");
			//msg.reply("i'm not clever enough to understand that yet :( if you think I should be smarter maybe go yell at robin")
			//	.then(msg => console.log(`Sent a reply to ${msg.author}`))
			//	.catch(console.error);
		}
	} //if mentioned
	//if the bot isn't mentioned, it just reads the message, checking for keywords that have been registered with it
	else if (checkTriggers(msg.content) != "none" && msg.author.username != "rob-bot" && msg.channel.type != "dm") {
		console.log("preparing content warning");
		var trigger = checkTriggers(msg.content);
		var usersToWarn = new Array();
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

/**
 * Adds a new trigger to the list of all triggers, as well as one for
 * the individual user who requested the warning
 */
function addTrigger(trigger, username) {
	if (!triggers.all.includes(trigger)) {
		triggers.all.push(trigger);
	}
	if (triggers.hasOwnProperty(username)) {
		//add trigger to array where key == username
		triggers[username].push(trigger);
	} else {
		triggers[username] = [trigger];
	}
}

/**
 * Checks if a given message contains any of the trigger keywords
 */
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
