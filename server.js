const http = require('http');
const querystring = require('querystring');
const Discord = require('discord.js');
const client = new Discord.Client();

http.createServer(function(req, res){
  if (req.method == 'POST'){
    var data = "";
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      if(!data){
        res.end("No post data");
        return;
      }
      var dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);
      if(dataObject.type == "wake"){
        console.log("Woke up in post");
        res.end();
        return;
      }
      res.end();
    });
  }
  else if (req.method == 'GET'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
  }
}).listen(3000);

client.on('ready', message =>{
  console.log(Discord.version);
  global.announcePost = null;
  client.user.setPresence({ game: { name: 'チーム分け' } });
});

client.on('message', message =>{
  if (message.author.id == client.user.id || message.author.bot){
    return;
  }
  if(message.content.match(/コアタイム|コアタイム/) 
     && message.content.match(/告知|告知/)) {
    sendMsg(message.channel.id, "新入生コアタイムだョ！　全員集合！");
    return;
  }
});

client.on('message', message => {
  if (message.author.id == client.user.id || message.author.bot
     && message.content.match("新入生コアタイムだョ！　全員集合！")) {
    global.announcePost = message;
    const filter = (reaction ) => reaction.emoji.name === '🆗';
    global.rc = global.announcePost.createReactionCollector(filter, {time : 86400000});
    global.rc.on('collect', r => console.log(r.users));
    global.rc.on('end', collected =>  {
      const userIds = [ ...collected.get('🆗').users.keys() ];
      console.log(userIds);
      var post = "発表します！";
      for (var i=0;i<userIds.length;i++) {
          if (i%3 == 0) {
              post += `\n\n カラ館 ${i/3 + 1}号室`;
          }  
          post += " <@" + userIds[i] + "> ";

      }
      sendMsg(message.channel.id, post);

      
    })
    return ;
  }
});

client.on('message', message => {
  if (message.author.id == client.user.id || message.author.bot) {
    return ;
  }
  if (message.content.match(/チーム分け|チーム分け/)) {
    // get member who reactioned to announce post id
    global.rc.stop();
  }
});

if(process.env.DISCORD_BOT_TOKEN == undefined){
 console.log('DISCORD_BOT_TOKENが設定されていません。');
 process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );

function sendReply(message, text){
  message.reply(text)
    .then(console.log("リプライ送信: " + text))
    .catch(console.error);
}

function sendMsg(channelId, text, option={}){
  client.channels.get(channelId).send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
}
