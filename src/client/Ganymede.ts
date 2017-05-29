import { Client, ListenerUtil, LogLevel } from 'yamdbf';

const config: any = require('../../config.json');
const pkg: any = require('../../package.json');

const { once } = ListenerUtil;

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
}