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

var announcePostId = "";
var announcePost = null;

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
    // store announce post id
    //announcePostId = message.id;
    //console.log(announcePostId);
    announcePost = message;
    
    // Create a reaction collector
    const filter = (reaction, user) => reaction.emoji.name === '👌' ;
    const collector = message.createReactionCollector(filter, { time: 15000 });
    collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));    
    console.log(message.content);
    return;
  }
  setTimeout(() => {
     console.log('interval')
  }, 5000)
});

client.on('message', message => {
  if (message.author.id == client.user.id || message.author.bot) {
    return ;
  }
  if (message.isMemberMentioned(client.user) 
      && message.content.match(/チーム分け|チーム分け/)) {
    // get member who reactioned to announce post id
    // console.log(announcePostId.reaction.fetch());
  }
})

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
