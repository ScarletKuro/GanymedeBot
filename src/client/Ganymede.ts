import { Client, ListenerUtil, LogLevel } from 'yamdbf';
import { TextChannel, RichEmbed, Message, Guild } from 'discord.js';

const config: any = require('../../config.json');
const pkg: any = require('../../package.json');

const { on, once } = ListenerUtil;

export class Ganymede extends  Client {

    public config: any;
    public constructor() {
        super({
            name: 'Ganymedebot',
            token: config.token,
            owner: config.owner,
            version: pkg.version,
            unknownCommandError: false,
            statusText: 'Under | Development',
            readyText: 'Ready\u0007',
            commandsDir: './commands',
            ratelimit: '10/1m',
            pause: true,
            logLevel: LogLevel.INFO
        });
        
        this.config = config;
    }

    @once('pause')
    private async _onPause(): Promise<void> {
        await this.setDefaultSetting('prefix', '%');
        await this.setDefaultSetting('cases', 0);
        this.emit('continue');
    }

    @once('clientReady')
    private async _onClientReady(): Promise<void> {
        
    }

    @on('guildCreate')
    @on('guildDelete', false)
    private _logGuild(guild: Guild, joined: boolean = true): Promise<Message> {
        const logChannel: TextChannel = <TextChannel> this.channels.get(this.config.guilds);
        const embed: RichEmbed = new RichEmbed()
            .setColor(joined ? 8450847 : 13091073)
            .setAuthor(`${guild.name} (${guild.id})`, guild.iconURL)
            .setFooter(joined ? 'Welcome to the Animosity server.' : 'Left guild')
            .setTimestamp();
        return logChannel.sendEmbed(embed);
    }
}