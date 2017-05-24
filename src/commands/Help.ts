import { RichEmbed } from 'discord.js';
import { Client, Command, Message } from 'yamdbf';

export default class Help extends Command<Client>
{
    public constructor(client: Client) {
        super(client, {
            name: 'help',
            description: 'Provides information on bot commands',
            aliases: [],
            usage: `<prefix>help [command]`,
            extraHelp: 'Will DM bot command help information to the user to keep clutter down in guild channels. If you use the help command from within a DM you will only receive information for the commands you can use within the DM. If you want help with commands usable in a guild, call the help command in a guild channel. You will receive a list of the commands that you have permissions/roles for in that channel.',
            group: 'base',
            overloads: 'help'
        });
    }

    public async action(message: Message, args: string[]): Promise<any> {
        let embed: RichEmbed = new RichEmbed();
        embed.addField('List of commands',
                '**ping**: Responds with Pong\n**info**: Info about the bot\n**8ball**: Let the 8ball preict your future\n**dailies**: Check when dailies reset\n**patch**: Displays link to revelation online patch notes',
                true)
            .setColor(0xFFDF00)
            .setFooter('Having issues? Maybe you just want to give feedback or chat :D? Message Kym#8163')
            .setThumbnail('https://pbs.twimg.com/profile_images/736231390300246017/3AO1B31W_400x400.jpg');

        message.channel.send({ embed: embed });
    }
}