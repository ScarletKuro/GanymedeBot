import { Client, Command, Message } from 'yamdbf';
import { pollWeatherData, WeatherData } from '../services/weatherService';
import DrawWeather from '../canvas/DrawWeather';

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

    public async action(message: Message, args: string[]): Promise<any> 
    {
		const location: string = args.join(' ');
		const service: WeatherData = await pollWeatherData(location);
		const graph: DrawWeather = new DrawWeather(service, 400, 180);
		graph.draw();
		return message.channel.send({ files: [{ attachment: graph.canvas.toBuffer(), name: location.concat('.png') }] });
    }
}
