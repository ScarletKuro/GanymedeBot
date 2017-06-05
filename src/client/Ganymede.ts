import { Client, ListenerUtil, LogLevel, Message } from 'yamdbf';
import { GuildMember, RichEmbed, TextChannel } from 'discord.js';

const config: any = require('../../config.json');
const pkg: any = require('../../package.json');

const { once, on } = ListenerUtil;

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

    @on('guildMemberAdd')
    @on('guildMemberRemove', false)
    private _logMember(member: GuildMember, joined: boolean = true): Promise<Message>
    {
        const memberLog: TextChannel = <TextChannel> member.guild.defaultChannel;
        const embed: RichEmbed = new RichEmbed()
			.setColor(joined ? 8450847 : 16039746)
			.setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL)
			.setFooter(joined ? 'User joined' : 'User left' , '')
        .setTimestamp();
        
        return memberLog.send({embed: embed});
    }
}