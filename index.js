var Discord = require("discord.js");
var bot = new Discord.Client();
//var ann1 = require("./coolClassifier.js");

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
		} else if (msg.content.includes("run" && "train")) {
			console.log("does nothing right now");
		} else {
			console.log("received a message i didn't understand");
			msg.reply("i'm not clever enough to understand that yet :( if you think I should be smarter maybe go yell at robin")
				.then(msg => console.log(`Sent a reply to ${msg.author}`))
				.catch(console.error);
		}
	}
});

bot.on("ready", botRdy => {
		console.log("bot is ready to go")
		console.log("training ANN");
		ann1.train();
		console.log("ANN trained");
});

bot.login("");

exports.bot = bot;
//this should not be down here, but the current layout dictates that it must for now
var ann1 = require("./coolClassifier.js");
