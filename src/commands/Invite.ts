import { RichEmbed } from 'discord.js';
import { Client, Command, Message } from 'yamdbf';

export default class Invite extends Command<Client>
{
    public constructor(client: Client) {
        super(client, {
            name: 'invite',
            description: 'Displays link to invite bot to your channel',
            aliases: [],
            usage: `<prefix>invite`,
            extraHelp: '',
            group: 'base'
        });
    }

    public async action(message: Message, args: string[]): Promise<any> {
        let embed: RichEmbed = new RichEmbed();

        embed.addField('Invite Link', 'Invite bot to your server')
            .setColor(0x33FF3C)
            .setThumbnail(message.author.avatarURL)
            .setDescription('[Invite me!](https://discordapp.com/oauth2/authorize?client_id=314440393062219777&scope=bot&permissions=2146958591)');
        message.channel.send({ embed: embed });
    }
}