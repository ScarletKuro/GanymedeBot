﻿import { Collection, RichEmbed } from 'discord.js';
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

    private padRight(text: string, length: number): string {
        let pad: number = Math.max(0, Math.min(length, length - text.length));
        return `${text}${' '.repeat(pad)}`;
    }

    public async action(message: Message, [commandName]: string[]): Promise<any> {
        {
            if (this.client.selfbot) message.delete();
            const dm: boolean = message.channel.type !== 'text';
            const mentionName: string = `@${this.client.user.tag}`;

            let command: Command<Client>;
            let output: string = '';
            let embed: RichEmbed = new RichEmbed();

            if (!commandName) {
                const preText: string = `Available commands: (Commands marked with \`*\` are server-only)\n\`\`\`ldif\n`;
                const postText: string = `\`\`\`Use \`<prefix>help <command>\` ${this.client.selfbot ? '' : `or \`${
                    mentionName} help <command>\` `}for more info\n\n`;

                const usableCommands: Collection<string, Command<Client>> = this.client.commands
                    .filter(c => !(!this.client.isOwner(message.author) && c.ownerOnly))
                    .filter(c => !c.hidden);

                const widest: number = usableCommands.map(c => c.name.length).reduce((a, b) => Math.max(a, b));
                let commandList: string = usableCommands.map(c =>
                    `${this.padRight(c.name, widest + 1)}${c.guildOnly ? '*' : ' '}: ${c.description}`).sort().join('\n');

                output = preText + commandList + postText;
                if (output.length >= 1024) {
                    commandList = '';
                    let mappedCommands: string[] = usableCommands
                        .sort((a, b) => a.name < b.name ? -1 : 1)
                        .map(c => (c.guildOnly ? '*' : ' ') + this.padRight(c.name, widest + 2));

                    for (let i: number = 0; i < mappedCommands.length; i++) {
                        commandList += mappedCommands[i];
                        if ((i + 1) % 3 === 0) commandList += '\n';
                    }
                    output = preText + commandList + postText;
                }
            }
            else {
                command = (await this.client.commands
                [dm ? 'filterDMUsable' : 'filterGuildUsable'](this.client, message))
                    .filter(c => c.name === commandName || c.aliases.includes(commandName))
                    .first();

                if (!command) output = `A command by that name could not be found or you do\n`
                    + `not have permissions to view it in this guild or channel`;
                else output = '```ldif\n'
                    + `Command: ${command.name}\n`
                    + `Description: ${command.description}\n`
                    + (command.aliases.length > 0 ? `Aliases: ${command.aliases.join(', ')}\n` : '')
                    + `Usage: ${command.usage}\n`
                    + (command.extraHelp ? `\n${command.extraHelp}` : '')
                    + '\n```';
            }

            output = dm ? output.replace(/<prefix>/g, '')
                : output.replace(/<prefix>/g, await this.client.getPrefix(message.guild) || '');

            embed.setColor(11854048).setDescription(output);

            let outMessage: Message;
            if (!dm && !this.client.selfbot) {
                if (!command) {
                     message.reply(`Sent you a DM with a list of commands.`);
                }
            }
            if (!command){
                if (this.client.selfbot) {
                    outMessage = <Message> await message.channel.send({ embed });
                }
                else{
                    message.author.send({ embed });
                }
            }
            else{
                 outMessage = <Message> await message.channel.send({ embed });
            }

            if (outMessage) {
                outMessage.delete(30e3);
            }
        }
    }
}