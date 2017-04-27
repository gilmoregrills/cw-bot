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
			console.log("preparing to greet "+msg.author);
			msg.reply("hi there!! ^^")
				.then(msg => console.log(`Sent a reply to ${msg.author}`))
				.catch(console.error);
		} else if (msg.content.includes("i" && "cool")) {
			console.log("preparing to see if this user is cool");
			//evaluate if that user is cool
			user = msg.author;
			var responseNo = Math.round(Math.random());
			if (responseNo == 0) {
				msg.reply("right now i'm afraid not, sorry :(")
					.then(msg => console.log(`Sent a reply to ${msg.author}`))
					.catch(console.error);
			} else {
				msg.reply("you are!! so cool <3")
					.then(msg => console.log(`Sent a reply to ${msg.author}`))
					.catch(console.error);
			}
		} else if (msg.content.includes("@" && "cool")) {
			console.log("preparing to check if another user is cool");
			user = msg.mentions.users.first();
			var responseNo = Math.round(Math.random());
			if (responseNo == 0) {
				msg.reply("i'm sorry to say that "+user+" is not cool :/")
					.then(msg => console.log(`Sent a reply to ${msg.author}`))
					.catch(console.error);
			} else {
				msg.reply("omg yes "+user+" is SO cool ^^")
					.then(msg => console.log(`Sent a reply to ${msg.author}`))
					.catch(console.error);
			}
		} else if (msg.content.includes("react")) {
			console.log("Reacting!");
			msg.react(bot.emojis.random())
				.then(msg => console.log(`Reacted to ${msg.content}`))
				.catch(console.error);
		} else if (msg.content.includes("warn") {
			console.log("logging content warning request");
			//var word = parse the message to find the word alone
			addTrigger(word, msg.author.username);
			msg.reply("keyword added, I'll keep an eye out!")
				.then(msg => console.log(`Sent a reply to ${msg.author}`))
				.catch(console.error);
		}
		} else {
			console.log("received a message i didn't understand");
			msg.reply("i'm not clever enough to understand that yet :( if you think I should be smarter maybe go yell at robin")
				.then(msg => console.log(`Sent a reply to ${msg.author}`))
				.catch(console.error);
		}
	} //if mentioned
	else if (var trigger = checkTriggers(msg.content) != "none") {
		console.log("preparing content warning");
		bot.users.find("username", "gilmoregrills#3990").sendMessage("just a heads up that "+trigger+" is being discussed in "+msg.channel.name)
			.then(msg => console.log("sent a content warning for: "+trigger))
			.catch(console.error);
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
	for (trigger in triggers.all) {
		if (message.includes(trigger) {
			return trigger;
			//return the trigger and break off
		}
	}
	return "none"; 
}

exports.bot = bot;
