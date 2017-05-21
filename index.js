const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const moment = require('moment');


const TOKEN = "MzE0NDQwMzkzMDYyMjE5Nzc3.C_-8CA.BU0SJFfTg8X2LzDsv_IHYrbai4E";
const PREFIX = "%";

function generateHex() {
     return '#' + Math.floor(Math.random()*16777215).toString(16);
}

//searches ytdl-core and plays youtube video (this node kinda sucks need a new one, only accepts links)
function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

//if queue is empty, leaves channel
    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

//8ball answers, so many positive ones, much unrealistic
var fortunes = [

    "Yes",
    "No",
    "Maybe",
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most Likely",
    "Outlook good",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My soures say no",
    "Outlook not so good",
    "Very doubtful"
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready");
    bot.user.setGame('Under | Development'); //Kuro will always be a scrub
});

bot.on("guildMemberAdd", function(member) {
    //welcome message, also adds new member to the scrub role, **role must already be created**
   member.guild.channels.find("name", "revelation").sendMessage(member.toString() + " Welcome to the Animosity server.");


   });


bot.on("message", function(message) {
    //If there is another bot ignore it
    if(message.author.equals(bot.user)) return;
    
    //if it doesnt start with the prefix why respond :/
    if (!message.content.startsWith(PREFIX))return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
       case "ping": //Description: Responds with Pong!
            message.channel.sendMessage("Pong!");
            break;
       case "info"://Description: Tells you info about the bot :D
            message.channel.sendMessage("I'm a super dope bot created by Kym.");
            break;
        case "8ball"://Description: Try your luck
           if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
           else message.channel.sendMessage("Can't read that");
           break;
        case "embed": //Description: just testing how to use embeds >.< will remove later
            var embed = new Discord.RichEmbed()
                .addField("Test Tilte", "Test Description", true)
                .addField("Test Tilte", "Test Description", true)
                .addField("Test Tilte", "Test Description", true)
                .addField("Test Tilte", "Test Description")
                .addField("Test Tilte", "Test Description")
                .setColor(0x00FFFF)
                .setFooter("This message is cool :D")
                .setThumbnail(message.author.avatarURL)
            message.channel.sendEmbed(embed);  
            break;
        case "noticeme"://Description: don't judge me
            message.channel.sendMessage(message.author.toString() + " hey") 
            break;
        case "senpai": //Description: refer to noticeme description
            message.channel.sendMessage(message.author.toString() + " hey senpai" )
            break;
        case "play": //Description: adds song to the queue ~ ) ' - ' ) ~ aayye it works
            if (!args[1]) {
                message.channel.sendMessage("Please provide a link.");
                return;
            }

            if (!message.member.voiceChannel) {
                 message.channel.sendMessage("You must be in a voice channel.");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1])

            var queued = new Discord.RichEmbed()

            .addField( 'Success',  ' Your song has been queued! ' + message.author.toString())
            .setColor(generateHex())

            message.channel.sendEmbed(queued);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip": //Description: skips current song
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop": //Description: stops song and leaves channel
            var server = servers[message.guild.id];

            if(message.guild.voiceConnection ) message.guild.voiceConnection.disconnect();
            break;
        case "pause": //Description: pauses current song
            var server = servers[message.guild.id];

            if(server.dispatcher) 
            
            server.dispatcher.pause()
            message.channel.sendMessage('paused');
            break;
        case "resume"://Description: resumes song
            var server = servers[message.guild.id];

            if(server.dispatcher) 
            
            server.dispatcher.resume()
            message.channel.sendMessage('resumed');
            break;
        case "dailies":
            var time1 = new Date().setHours(3, 0, 0, 0);
            var time2 = new Date(); //current time

            if (time2 < time1) {
                time2.setDate(time2.getDate() + 1);
            }
            var diff = time1 - time2;

             var msec = diff;

             var hh = Math.floor(msec / 1000 / 60 / 60);         
             msec -= hh * 1000 * 60 * 60;
             var mm = Math.floor(msec / 1000 / 60);
             msec -= mm * 1000 * 60;
             var ss = Math.floor(msec / 1000);
             msec -= ss * 1000;

             hh = Math.abs(hh);

             var dailies = new Discord.RichEmbed()

             .setDescription("Dailies reset in " + hh + " hours " + mm + " minutes and " + ss + " seconds.")
            .addField( 'Revelation Online', 'Animosity Guild' )
            .setColor(generateHex())
            .setThumbnail('http://scontent.cdninstagram.com/t51.2885-19/s150x150/14279006_541127449407788_1752394391_a.jpg')

             message.channel.sendEmbed(dailies);
             break;
        case "patch":
              var patch = new Discord.RichEmbed()

              .addField('Patch Notes', 'Animosity Guild')
              .setDescription('https://ro.my.com/forum/board/4-patch-notes-maintenances/');

              message.channel.sendEmbed(patch);
              break;
        case "help":
              var help = new Discord.RichEmbed()
                .addField("List of commands", "**ping**: Responds with Pong\n**info**: Info about the bot\n**8ball**: Let the 8ball preict your future\n**dailies**: Check when dailies reset\n**patch**: Displays link to revelation online patch notes", true)
                .setColor(0xFFDF00)
                .setFooter("Having issues? Maybe you just want to give feedback or chat :D? Message Kym#8163")
                .setThumbnail('https://pbs.twimg.com/profile_images/736231390300246017/3AO1B31W_400x400.jpg')
              message.channel.sendEmbed(help);
              break;
       default:
     
             message.channel.sendMessage("Invalid command");
    }
});

bot.login(TOKEN);
