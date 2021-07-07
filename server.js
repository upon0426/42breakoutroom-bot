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

let userStatus = [];

client.on("presenceUpdate", (oldMember, newMember) => {
  let username = newMember.user.username;
  let status = newMember.user.presence.status;
  userStatus.push(username, status);
  console.log(`${newMember.user.username} is now ${newMember.user.presence.status}`);
})

client.on('ready', message =>{
  console.log('ready');
  client.user.setPresence({ game: { name: 'チーム分け' } });
});

client.on('message', message =>{
  if (message.author.id == client.user.id || message.author.bot){
    return;
  }
  if(message.isMemberMentioned(client.user) 
     && message.content.match(/コアタイム|コアタイム/) 
     && message.content.match(/告知|告知/)) {
    sendMsg(message.channel.id, "新入生コアタイムだョ！　全員集合！");
    return;
  }
  setInterval(() => {
     console.log('interval')
  }, 5000)
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
