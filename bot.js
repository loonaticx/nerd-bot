var Discord = require('discord.js'),
    client = new Discord.Client(),
    jokeList = require('./databases/jokes.json'),
    stats = require('./databases/stats.json'),
    config = require('./config.json');

client.on('ready', () => {
    console.log('Connected as: ' + client.user.username + '\nBot ID: ' + client.user.id);
    client.channels.get(config.log_channel).send('```cmd\nConnected as: ' + client.user.username + '\nBot ID: ' + client.user.id + '```');
});

var count = 0;

var joke = ["tellmeajoke", "tellmejoke", "tellmeagoodjoke"];

var imagetypes = [undefined, 'jokes'];

client.on('message', async function(message) {

    if (message.author.id !== client.user.id) {

        var send = (imagetype, options) => {
            if (imagetype) {
                stats[imagetypes[imagetype]]++;

                require('fs').writeFileSync('./databases/stats.json', JSON.stringify(stats));
                var list = jokeList[imagetypes[imagetype]];
                var listLength = list.length;
                var file = list[Math.floor(Math.random() * list.length)];
                options = file;
            }

            var log = `${message.author.username}#${message.author.discriminator} (${message.author.id}): ${message.content}`;
            client.channels.get(config.log_channel).send(log);
            console.log(log);
            return message.channel.send(options);
        };

        var trusted = false;

        if (message.author.id === config.bot_owner || config.trusted_user.indexOf(message.author.id) + 1)
            trusted = true;

        var ms = message.content.toLowerCase().replace(/ /g, ''),
            m = ms.replace(/[^a-z]/g, '');

        if (joke.indexOf(m) + 1)
            send(1, `Test`);

        else if ((message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`))) {

            var mc = message.content.replace(new RegExp(`<@!{0,1}${client.user.id}>`), '').toLowerCase().trim();

            if (mc === 'stats')
                send(0, `Jokes sent: ${stats.jokes}`);

            else if (mc === 'count')
                send(0, `Number of jokes loaded: ${'jokes'.length}`);

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