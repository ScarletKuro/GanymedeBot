import { Client, Command, Message } from 'yamdbf';
import { pollWeatherData, WeatherData } from '../services/WeatherService';
import DrawWeather from '../canvas/DrawWeather';
import { ApiException } from '../model/ApiException';
import { RichEmbed } from 'discord.js';

export default class Weather extends Command<Client>
{
    public constructor(client: Client) {
        super(client, {
            name: 'weather',
            description: 'Get the weather',
            aliases: ['w'],
            usage: `<prefix>weather <location> <messagecontent>`,
            extraHelp: '',
            group: 'base'
        });
    }

    public async action(message: Message, args: string[]): Promise<any> {
        const location: string = args.join(' ');
        pollWeatherData(location).then((result: WeatherData): Promise<Message> => {
            const graph: DrawWeather = new DrawWeather(result, 400, 180);
            graph.draw();
            return message.channel.send({ files: [{ attachment: graph.canvas.toBuffer(), name: location.concat('.png') }] });
        }).catch((ex: Error): Promise<Message> => {
            let embed: RichEmbed = new RichEmbed();
            embed
                .setColor(0xff0000)
                .setThumbnail('http://www.freeiconspng.com/uploads/error-icon-4.png')
                .setTimestamp();

            if (ex instanceof ApiException) {
                embed.setDescription(ex.message)
                    .setAuthor('Api Exception');
                return message.channel.send({ embed: embed });
            }
            else {
                console.log(ex.message);
                embed.setDescription('Error durring getting data')
                    .setAuthor('Unhandled Exception');
                return message.channel.send({ embed: embed });
            }

        });

        //const service: WeatherData = await pollWeatherData(location);
        //const graph: DrawWeather = new DrawWeather(service, 400, 180);
        //graph.draw();
        //return message.channel.send({ files: [{ attachment: graph.canvas.toBuffer(), name: location.concat('.png') }] });
    }
}
