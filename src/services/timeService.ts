import * as request from 'request-promise';
import { ITimezonedbModel } from '../model/timezonedbModel';

const API_KEY: string = 'HH85TY131SR3';

export function pollTimeData(lat: number, lng: number): Promise<TimeData> {
    let timeUrl: string = `http://api.timezonedb.com/v2/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`;

    let timePromise: request.RequestPromise = request({
        uri: timeUrl,
        json: true
    });
    
    return Promise.all([timePromise]).then(jsons => Promise.resolve(new TimeData(jsons[0])));
}

export class TimeData {
    public time: Date;
    public constructor(data: ITimezonedbModel) {
        let date: Date = new Date(data.timestamp  * 1000);
        this.time = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
}