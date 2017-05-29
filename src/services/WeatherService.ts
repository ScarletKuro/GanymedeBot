import * as request from 'request-promise';
import { IWeatherDatum } from '../model/OpenWeatherModel';
import { pollTimeData, TimeData } from './TimeService';

const API_KEY: string = '42cd627dd60debf25a5739e50a217d74';

export async function pollWeatherData(cityName: String): Promise<WeatherData> {
  cityName = cityName.trim();
  let forecastUrl: string = 'http://api.openweathermap.org/data/2.5/forecast';
  let currentUrl: string = 'http://api.openweathermap.org/data/2.5/weather';

  let currentPromise: request.RequestPromise = request({
    method: 'GET',
    uri: currentUrl,
    json: true,
    qs: {
      type: 'like',
      units: 'metric',
      q: cityName,
      appid: API_KEY
    }
  });

  let forecastPromise: request.RequestPromise = request({
    method: 'GET',
    uri: forecastUrl,
    json: true,
    qs: {
      type: 'like',
      units: 'metric',
      q: cityName,
      appid: API_KEY
    }
  });

  return Promise.all([currentPromise, forecastPromise]).then(
    async jsons => {
      let weatherData: WeatherData = new WeatherData(jsons[0], jsons[1]);
      let timeData: TimeData = await pollTimeData(weatherData.coord.lat, weatherData.coord.lon);
      weatherData.currenTime = timeData.time;
      return Promise.resolve(weatherData);
    });
}

export class WeatherData {

  public static getAverageWeatherDescription(day: IWeatherDatum[]): string {
    let cloudForecasts: number = day.filter((forecast) => (forecast.weather === 'Clouds')).length;
    let rainForecasts: number = day.filter((forecast) => (forecast.weather === 'Rain')).length;
    let snowForecasts: number = day.filter((forecast) => (forecast.weather === 'Snow')).length;
    if (rainForecasts > 3) {
      return 'rain';
    }
    if (snowForecasts > 3) {
      return 'snow';
    }
    if (cloudForecasts > 2 && rainForecasts > 0) {
      return 'cloudy, some rain';
    }
    if (cloudForecasts > 2 && snowForecasts > 0) {
      return 'cloudy, some snow';
    }
    if (cloudForecasts > 3) {
      return 'cloudy';
    }
    return 'clear';
  }

  public cityName: string;
  public countryName: string;
  public list: IWeatherDatum[];
  public days: IWeatherDatum[][];
  public sunriseTime: Date;
  public sunsetTime: Date;
  public currenTime: Date;
  public coord: { lon: number, lat: number };

  public constructor(current: any, forecast: any) {
    this.currenTime = new Date(current.dt * 1000);
    this.coord = { lon: current.coord.lon, lat: current.coord.lat };
    this.cityName = forecast.city.name;
    this.countryName = forecast.city.country;
    this.sunriseTime = new Date(current.sys.sunrise * 1000);
    this.sunsetTime = new Date(current.sys.sunset * 1000);
    this.list = [this.parseDatum(current)].concat(forecast.list.map(this.parseDatum));
    this.days = [];
    let day: any = this.list[0].date.getDate();
    let matchDay: any = (datum: any): boolean => datum.date.getDate() === day;
    while (this.list.some(matchDay)) {
      this.days.push(this.list.filter(matchDay));
      day++;
    }
  }

  public getWeatherAtDate(date: Date): IWeatherDatum {
    if (date < this.list[0].date) {
      return this.list[0];
    }
    for (let index: number = 0; index < this.list.length - 1; index++) {
      if (this.list[index].date <= date && this.list[index + 1].date >= date) {
        return this.linearInterpolate(this.list[index], this.list[index + 1], date.getTime());
      }
    }
    return this.list[this.list.length - 1];
  }

  private linearInterpolate(previous: IWeatherDatum, next: IWeatherDatum, time: number): IWeatherDatum {
    let [prevTime, nextTime] = [previous.date.getTime(), next.date.getTime()];
    let a: number = (time - prevTime) / (nextTime - prevTime);
    return {
      date: new Date(time),
      weather: (a < 0.5) ? previous.weather : next.weather,
      weatherDetailed: (a < 0.5) ? previous.weatherDetailed : next.weatherDetailed,
      weatherIcon: (a < 0.5) ? previous.weatherIcon : next.weatherIcon,
      temperature: previous.temperature + a * (next.temperature - previous.temperature),
      pressure: previous.pressure + a * (next.pressure - previous.pressure),
      humidity: previous.humidity + a * (next.humidity - previous.humidity),
      cloudCoverage: previous.cloudCoverage + a * (next.cloudCoverage - previous.cloudCoverage),
      windSpeed: previous.windSpeed + a * (next.windSpeed - previous.windSpeed),
      windDirection: previous.windDirection + a * (next.windDirection - previous.windDirection),
      rain: previous.rain + a * (next.rain - previous.rain),
      snow: previous.snow + a * (next.snow - previous.snow)
    };
  }

  private parseDatum(datum: any): IWeatherDatum {
    return {
      date: new Date(datum.dt * 1000),
      weather: datum.weather[0].main,
      weatherDetailed: datum.weather[0].description,
      weatherIcon: datum.weather[0].icon,
      temperature: datum.main.temp,
      pressure: datum.main.pressure,
      humidity: datum.main.humidity,
      cloudCoverage: datum.clouds.all,
      windSpeed: datum.wind.speed,
      windDirection: datum.wind.deg,
      rain: datum.rain ? datum.rain.hasOwnProperty('3h') ? datum.rain['3h'] : 0 : 0,
      snow: datum.snow ? datum.snow.hasOwnProperty('3h') ? datum.snow['3h'] : 0 : 0
    };
  }
}