import * as request from 'request-promise';
import { ITimezonedbModel } from '../model/TimezonedbModel';
import { ApiException } from '../model/ApiException';
import { StatusCodeError } from 'request-promise/errors';
const TIMEOUT: number = 2000;
const TOO_MANY_REQUESTS: number = 503;
const API_KEY: string = 'HH85TY131SR3';

export function pollTimeData(lat: number, lng: number): Promise<TimeData> {
    if (API_KEY.length === 0) {
        return Promise.reject(new ApiException('TimeZoneDB: API key is not set'));
    }

    const timeUrl: string = 'http://api.timezonedb.com/v2/get-time-zone';

    const timeOption: request.Options = ({
        method: 'GET',
        uri: timeUrl,
        json: true,
        qs: {
            key: API_KEY,
            format: 'json',
            by: 'position',
            lat: lat,
            lng: lng
        }
    });

    let timePromise: Promise<ITimezonedbModel> = fetchWithBackoff(timeOption);
    return Promise.all([timePromise]).then(jsons => Promise.resolve(new TimeData(jsons[0])));

    /*
    let timePromise: request.RequestPromise = request({
        method: 'GET',
        uri: timeUrl,
        json: true,
        qs: {
            key: API_KEY,
            format: 'json',
            by: 'position',
            lat: lat,
            lng: lng
        }
    });
    
    return Promise.all([timePromise]).then(jsons => Promise.resolve(new TimeData(jsons[0])));*/
}

function fetchWithBackoff(options: any, waitTime?: number): Promise<ITimezonedbModel> {
    return new Promise((resolve, reject) => {
        if (waitTime > TIMEOUT) {
            reject(new ApiException('TimeZoneDB: Timeout fetching data'));
        }
        setTimeout(() => {
            request(options).then(function (response: ITimezonedbModel): void {
                    if (response.status === 'OK') {
                        resolve(response);
                    }
                    else {
                        reject(new ApiException(`TimeZoneDB: ${response.message}`));
                    }
            })
                .catch(function (error: StatusCodeError): void {
                    if (error.statusCode === TOO_MANY_REQUESTS) {
                        resolve(fetchWithBackoff(options, waitTime ? (2 * waitTime) : 50));
                    }
                    else {
                        reject(error);
                    }
                });
        }, waitTime);
    });
}

export class TimeData {
    public time: Date;
    public constructor(data: ITimezonedbModel) {
        let date: Date = new Date(data.timestamp * 1000);
        this.time = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
}