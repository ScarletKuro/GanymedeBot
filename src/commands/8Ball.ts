import { Client, Command, Message } from 'yamdbf';

const responses: string[] = [
    'Yes',
    'No',
    'Maybe',
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most Likely',
    'Outlook good',
    'Signs point to yes',
    'Reply hazy try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
    "Don't count on it",
    'My reply is no',
    'My soures say no',
    'Outlook not so good',
    'Very doubtful'
];

export default class EightBall extends Command<Client>
{
    public constructor(client: Client) {
        super(client, {
            name: '8ball',
            description: 'Let the 8ball preict your future',
            aliases: ['8'],
            usage: `<prefix>8ball`,
            extraHelp: '',
            group: 'base'
        });
    }

    public async action(message: Message, args: string[]): Promise<any> {
        if (args.length > 1)
        message.reply(`${responses[Math.floor(Math.random() * responses.length)]}`);
    }
}