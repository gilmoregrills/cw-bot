Content Warnings

To add a warning the chat command is: @[botname] warn [keyword]

The bot will reply with a confirmation message, and add an array containing the keyword to a JSON object with the key the name of the user - or update an existing one. It also adds the keyword to a list of global words.  

The bot then scans every message for items from the list of all keywords. If found, it searches each user's personal lists and if it finds the keyword it adds them to the list of users that need warning. Then the bot sends a DM to every user on that list with the type of content as well as the channel.
