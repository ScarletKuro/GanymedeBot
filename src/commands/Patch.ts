import { RichEmbed } from 'discord.js';
import { Client, Command, Message } from 'yamdbf';

export default class Patch extends Command<Client>
{
    public constructor(client: Client) {
        super(client, {
            name: 'patch',
            description: 'Displays link to revelation online patch notes',
            aliases: [],
            usage: `<prefix>patch`,
            extraHelp: '',
            group: 'base'
        });
    }

    public async action(message: Message, args: string[]): Promise<any> {
        let embed: RichEmbed = new RichEmbed();

        embed.addField('Patch Notes', 'Animosity Guild')
            .setDescription('https://ro.my.com/forum/board/4-patch-notes-maintenances/');

        message.channel.send({ embed: embed });
    }
}