const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const client = new Discord.Client();
const steamkeyRegex = /[A-Z,0-9]{5}-[A-Z,0-9]{5}-[A-Z,0-9]{5}/;
const originRegex = /[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}/;
var games = new Array();

function loadDB(){
  fs.readFile("db.json", function(err, buff) {
    games = JSON.parse(buff.toString());
  });
};

client.on('ready', () => {
  loadDB();
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  console.log(msg);
  if(msg.channel.name === config.DISCORD_CHANNEL && msg.author.username != 'Steam-Key-Bot')
  {
    if (msg.content === '!help') {
      msg.reply('What up?!?!!? This is the land of free games!  If you want to take advantage here is the run down: \n\r !list : This command will list all the game titles we have keys for. \n\r !addkey : This command lets you add keys that other users can claim. \n\r `!addKey Shadow of Mordor 14414-AADB-5534`\n\r !claim : This lets you claim a game that we have a key for. \n\r `!claim Shadow of Mordor`\n\r That\'s pretty much it.  If you run into any problems just @TheDancingFetus and I\'ll help you out.');
    }
    else if(msg.content.match(/^![l,L][i,I][s,S][t,T]$/)) {
      var reply = '\n';
      if(games.length > 0)
      {
        var names = games.map(a => a.name);
        var uniqueNames = [...new Set(names)];
        for(var i = 0; i < uniqueNames.length; i++)
        {
          reply += uniqueNames[i] + '\n';
        }
        msg.reply(reply);
      }
      else {
        msg.reply('All games are currently claimed.  Check back to see if new games have been added later.')
      }
    }
    else if (msg.content.match(/^![a,A][d,D][d,D][k,K][e,E][y,Y]\s.*[A-Z,0-9]{5}-[A-Z,0-9]{5}-[A-Z,0-9]{5}/)) {
      var game = {
        name: msg.content.replace(/^![a,A][d,D][d,D][k,K][e,E][y,Y]\s/,"").replace(/\s[A-Z,0-9]{5}-[A-Z,0-9]{5}-[A-Z,0-9]{5}/,""),
        key: msg.content.match(/[A-Z,0-9]{5}-[A-Z,0-9]{5}-[A-Z,0-9]{5}/)[0]
      };
      games.push(game);
      fs.writeFile("db.json", JSON.stringify(games), (err) => {
        if (err) console.log(err);
        console.log("Wrote DB");
      });
      msg.delete();
      msg.reply('Added a key for game ' + msg.content.replace(/^![a,A][d,D][d,D][k,K][e,E][y,Y]\s/,"").replace(/\s[A-Z,0-9]{5}-[A-Z,0-9]{5}-[A-Z,0-9]{5}/,""));
    }
    else if (msg.content.match(/^![a,A][d,D][d,D][k,K][e,E][y,Y]\s.*[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}/))
    {
      var game = {
        name: msg.content.replace(/^![a,A][d,D][d,D][k,K][e,E][y,Y]\s/,"").replace(/\s[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}/,"") + " EA Origin Key",
        key: msg.content.match(/[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}/)[0]
      };
      games.push(game);
      fs.writeFile("db.json", JSON.stringify(games), (err) => {
        if (err) console.log(err);
        console.log("Wrote DB");
      });
      msg.delete();
      msg.reply('Added an Origin key for game ' + msg.content.replace(/^![a,A][d,D][d,D][k,K][e,E][y,Y]\s/,"").replace(/\s[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}-[A-Z,0-9]{4}/,""));
    }
    else if (msg.content.match(/^![c,C][l,L][a,A][i,I][m,M]\s.*/)) {
      var claimedGame = msg.content.replace(/^![c,C][l,L][a,A][i,I][m,M]\s/,"");
      var claimedObject = games.find(obj => obj.name == claimedGame);
      if(claimedObject != null)
      {
        var index = games.findIndex(obj => obj.key == claimedObject.key);
        games.splice(index,1);
        if(games.length == 0)
        {
          fs.writeFile("db.json", "[]", (err) => {
            if (err) console.log(err);
            console.log("Wrote DB");
          });
        }
        else
        {
          fs.writeFile("db.json", JSON.stringify(games), (err) => {
            if (err) console.log(err);
            console.log("Wrote DB");
          });
        }
        msg.member.send('Your Game: \n\r' + claimedObject.name + " " + claimedObject.key)
        msg.reply('Claimed Game: ' + claimedGame);
      }
      else
      {
        msg.reply('Sorry, couldn\'t find that game.  Check the name using !list');
      }
    }
    else if(msg.content.match(steamkeyRegex) != null || msg.content.match(originRegex) != null) {
      msg.delete();
      msg.reply('You posted a Game Key! To make it easier to keep track on what keys have been used, please post doing the following: \n\r `!addkey Name of Game Key` \n\r Example: `!addKey Shadow of Mordor 14414-AADB-5534` \n\r You can view all the games in our key inventory by typing `!list`.  If you see a game you want, just type `!claim Name of Game`.  Please try to use the Steam Store Page names of games you add to lower the amount of Duplicate Names.\n\r Thanks!');
    }
  }
});

client.login(config.BOT_TOKEN);
