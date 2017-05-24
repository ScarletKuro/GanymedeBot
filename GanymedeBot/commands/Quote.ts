import { Collection, RichEmbed, TextChannel } from "discord.js";
import { Client, Command, GuildStorage, Message, Middleware, CommandDecorators } from "yamdbf";

const { resolveArgs, expect } = Middleware;
const { using } = CommandDecorators;

export default class Quote extends Command<Client>
{
    public constructor(client: Client) {
        super(client, {
            name: "quote",
            description: "Helps to quote someone message",
            aliases: ["q"],
            usage: `<prefix>quote <messageid> <messagecontent>`,
            extraHelp: "",
            group: "base"
        });
    }

    @using(expect({ '<messageid>': 'String' }))
    public async action(message: Message, [messageid, ...messagecontent]: [string, string]): Promise<any> {

        const messages: Message[] = (await message.channel.fetchMessages(
            { limit: 100, before: message.id })).filter((a: Message) => a.id === messageid).array();

        if (messages.length === 0) {
            //message.delete();
            message.reply("the message with this ID wasn't found");
        } else {
            
            let quotedMessage = messages[0];
            message.channel.send({
                embed: {
                    author: {
                        name: `${quotedMessage.author.username} said:`,
                        icon_url: quotedMessage.author.avatarURL ? quotedMessage.author.avatarURL : undefined
                    },
                    description: quotedMessage.content
                }
            }).then(m => message.channel.send(messagecontent.join(" ")));
        }
    }
}