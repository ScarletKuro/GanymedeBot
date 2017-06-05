import * as request from 'request-promise';
import * as moment from 'moment';
import { ITimezonedbModel } from '../model/TimezonedbModel';
import { ApiException } from '../model/ApiException';
import { StatusCodeError } from 'request-promise/errors';

const TIMEOUT: number = 2000;
const TOO_MANY_REQUESTS: number = 503;
const API_KEY: string = 'HH85TY131SR3';

export async function pollTimeData(lat: number, lng: number): Promise<TimeData> {
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

    let json: ITimezonedbModel = await fetchWithBackoff(timeOption);
    return Promise.resolve(new TimeData(json));
    //let timePromise: Promise<ITimezonedbModel> = fetchWithBackoff(timeOption);
    //return Promise.all([timePromise]).then(jsons => Promise.resolve(new TimeData(jsons[0])));
}

function fetchWithBackoff(options: any, waitTime?: number): Promise<ITimezonedbModel> {
    return new Promise((resolve, reject) => {
        if (waitTime > TIMEOUT) {
            reject(new ApiException('TimeZoneDB: Timeout fetching data'));
        }
        setTimeout(() => {
            request(options).then((response: ITimezonedbModel): void => {
                    if (response.status === 'OK') {
                        resolve(response);
                    }
                    else {
                        reject(new ApiException(`TimeZoneDB: ${response.message}`));
                    }
                })
                .catch((error: StatusCodeError): void => {
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
        this.time =  moment.utc(data.timestamp * 1000).toDate();
    }
}