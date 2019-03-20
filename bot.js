var Discord = require('discord.js'),
    client = new Discord.Client(),
    jokeList = require('./databases/jokes.json'),
    stats = require('./databases/stats.json'),
    info = require('./databases/info.json'),
    config = require('./config.json');


client.on('ready', () => {
    console.log('Connected as: ' + client.user.username + '\nBot ID: ' + client.user.id);
    client.channels.get(config.log_channel).send('```cmd\nConnected as: ' + client.user.username + '\nBot ID: ' + client.user.id + '```');
});

var joke = ["tellmeajoke", "tellmejoke", "tellmeagoodjoke"];
var t = ["asparagus"];
var image = ["showmesexypcpics", "showmecomputerpics"];

var statArgs = [undefined, 'jokes', 'amanblame', 'billblame'];

client.on('message', async function(message) {
    if (message.author.id !== client.user.id) {
        var send = (joketype, options) => {
            if (joketype) {
                stats[statArgs[joketype]]++;
                require('fs').writeFileSync('./databases/stats.json', JSON.stringify(stats));
                  if(joketype == 2) { //<@245369679718121482>
                    return message.channel.send(`<@245369679718121482> has been blamed for doing something. <:muscle:555240231704461330> Total times <@245369679718121482> has been blamed for doing something: ${stats.amanblame}`);
                  }
                  else if(joketype == 3) { //<@245369679718121482>
                    return message.channel.send(`<@260598703319023626> has been blamed for doing something. <:rainbow:555240965053349898> Total times <@260598703319023626> has been blamed for doing something: ${stats.billblame}`);
                  }
                var list = jokeList[statArgs[joketype]];
                var file = list[Math.floor(Math.random() * list.length)];
                options = file;
            }

            var log = `${message.author.username}#${message.author.discriminator} (${message.author.id}): ${message.content}`;
            client.channels.get(config.log_channel).send(log);
            console.log(log);
            return message.channel.send(options);
        };

        var trusted = false;
        var lazy = message.content.replace(new RegExp(`<@!{0,1}${client.user.id}>`), '').toLowerCase().trim();
        if (message.author.id === config.bot_owner || config.trusted_user.indexOf(message.author.id) + 1)
            trusted = true;
        var ms = message.content.toLowerCase().replace(/ /g, ''),
            m = ms.replace(/[^a-z]/g, '');
        if (joke.indexOf(m) + 1)
            send(1, `funny joke time`);
        else if (lazy.includes("blameaman") || lazy.includes("blame aman"))
            send(2, "fuck");
        else if (lazy.includes("blamebill") || lazy.includes("blame bill"))
            send(3, "fuck");

        else if ((message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`))) {
            var mc = message.content.replace(new RegExp(`<@!{0,1}${client.user.id}>`), '').toLowerCase().trim();
            if (mc === 'stats')
                send(0, `Jokes sent: ${stats.jokes}\nTimes Aman has been blamed for doing something: ${stats.amanblame}\nTimes Bill has been blamed for doing something: ${stats.billblame}`);
            else if (mc === 'count')
                send(0, `Number of jokes loaded: ${'jokes'.length}`);
            else if (mc === 'give me some info you dumb bot')
                send(0, `${info.wip}`);
            else if (mc === 'reboot' && trusted)
                send(0, 'rebooting...').then(() => process.exit(0));
            else if (mc.startsWith('say') && trusted) {
                let c = message.content.replace(new RegExp(`<@!{0,1}${client.user.id}> say`), '').trim();
                if (message.deletable)
                    message.delete();
                send(0, c);
            }
        }
    }
});

client.login(config.token);
