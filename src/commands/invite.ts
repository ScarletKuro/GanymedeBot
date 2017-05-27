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

        embed.setAuthor(this.client.name)
            .setColor(0xffff00)
            .setThumbnail('https://vignette2.wikia.nocookie.net/overwatch/images/d/d2/Bastion_Spray_-_Ganymede.png')
            .setDescription(`[Click](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=2146958591) here to invite me to your server.`);
        message.channel.send({ embed: embed });
    }
}