import * as fs from 'fs';
import * as path from 'path';
import { WeatherData, WeatherDatum } from '../services/weatherService';
import { CanvasTable } from './canvasTable';
import { getCountryName } from '../data/countryISO';
import CanvasClock from "./canvasClock";

const Canvas: any = require('canvas');
const Image: any = Canvas.Image;
const DAY_NAMES: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BACKGROUND_COLOR: string = 'rgb(1, 176, 241)';
const TIMELINE_BACKGROUND_COLOR: string = 'rgb(255, 255, 255)';
const MAIN_FONT_COLOR: string = 'rgb(255, 255, 255)';
const TIMELINE_FONT_COLOR: string = 'rgb(0, 0, 0)';

export default class DrawWeather {
    public canvas: any;
    private data: WeatherData;
    private currentWeather: WeatherDatum;
    // private dataPoints: WeatherDatum[];
    private width: number;
    private height: number;
    private iconSize: { width: number, height: number };
    public constructor(properties: WeatherData, width: number, height: number) {
        // this.loadFont('Roboto', 'fonts', 'Roboto-Regular.ttf');
        this.loadFont('Goulong ', 'fonts', 'Goulong-Regular.ttf');
        this.width = width;
        this.height = height;
        this.data = properties;
        this.currentWeather = properties.list[0];
        this.iconSize = { height: 60, width: 60 };
        this.canvas = new Canvas(this.width, this.height);
        //this.canvas = new Canvas(1200, 451);
    }

    public draw(): void {
        let ctx: any = this.canvas.getContext('2d');
        this.drawBackground(ctx);
        this.drawIcon(ctx);
        this.drawWeatherTimeline(ctx);
        this.drawText(ctx);
        this.drawDetails(ctx);
        this.drawClock(ctx);
    }

    public drawClock(ctx: any): void {
        let hhmmgapsize: number = 6;
        let offset: {x: number, y: number } = { x: 10, y: 10 };
        let size: { width: number, height: number } = { width: 26.25, height: 45 };
        let pos: { x: number, y: number } = { x: this.width - size. width * 4 - offset.y - hhmmgapsize, y: 0 + offset.x };
        const clock: CanvasClock = new CanvasClock(this.currentWeather.date, ctx, size.width, size.height, hhmmgapsize);
        clock.draw(pos.x, pos.y);
    }

    public drawWeatherTimeline(ctx: any): void {
        const table: CanvasTable = new CanvasTable(ctx, 50, 50, 6, 1);
        const currentday: string = this.getDay(this.currentWeather.date);
        let days: string[] = DAY_NAMES.filter(day => day !== currentday);
        for (let i: number = 0; i < days.length; i++) {
            const iconImage: { src: Buffer } = new Image();
            let day: Date = new Date();
            day.setDate(this.currentWeather.date.getDate() + i + 1);
            let data: WeatherDatum = this.data.getWeatherAtDate(day);
            iconImage.src = this.loadAsset('icons', data.weatherIcon.concat('.png'));
            table.insertItem(i, 0, this.getDay(day), iconImage, `${Math.round(data.temperature)}°`);
        }

        table.draw(90, 125);
    }

    private getDay(day: Date): string {
        return DAY_NAMES[new Date(day).getDay()];
    }

    private drawBackground(ctx: any): void {
        // const backgroundImage: { src: any } = new Image();
        // backgroundImage.src = await this.loadAsset('base', 'cloudy.png');
        // ctx.drawImage(backgroundImage, 0, 0);
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, this.width, this.height);
        // ctx.scale(1, 1);
        // ctx.patternQuality = 'billinear';
        // ctx.filter = 'bilinear';
        // ctx.antialias = 'subpixel';
        ctx.fillStyle = TIMELINE_BACKGROUND_COLOR;
        ctx.fillRect(0, this.height / 1.5, this.width, this.height);
    }

    private drawText(ctx: any): void {
        ctx.font = '20px Goulong';
        ctx.fillStyle = MAIN_FONT_COLOR;
        ctx.fillText(this.data.cityName, 10, 30);

        ctx.font = '15px Goulong';
        ctx.fillStyle = MAIN_FONT_COLOR;
        ctx.fillText(getCountryName(this.data.countryName), 10, 55);

        ctx.font = '30px Goulong';
        ctx.fillStyle = TIMELINE_FONT_COLOR;
        ctx.fillText(`${Math.round(this.currentWeather.temperature)}°`, 30, this.height / 1.5 + 35);

        ctx.font = '14px Goulong';
        ctx.fillStyle = TIMELINE_FONT_COLOR;
        ctx.fillText(`${this.getDay(this.currentWeather.date)}  ${this.getOridnal(this.currentWeather.date.getUTCDate())}` , 20, this.height / 1.5 + 55);

        ctx.font = '15px Goulong';
        ctx.fillStyle = MAIN_FONT_COLOR;
        ctx.fillText(getCountryName(this.currentWeather.weatherDetailed), 10, this.height / 1.5 - 10);
    }

    private drawDetails(ctx: any): void{
        const humid: { src: Buffer } = new Image();
		const precip: { src: Buffer } = new Image();
        humid.src = this.loadAsset('icons', 'humidity.png');
        precip.src = this.loadAsset('icons', 'precip.png');
        
        ctx.drawImage(humid, 380, 80);
		ctx.drawImage(precip, 380, 100);
		ctx.font = '15px Goulong';
        ctx.textAlign = 'right';
        ctx.fillStyle = MAIN_FONT_COLOR;
		ctx.fillText(`${this.currentWeather.humidity}%`, 378, 80 + 11);
		ctx.fillText(`${this.currentWeather.rain}`, 378, 100 + 11);
    }

    private wrapText(context: any, text: string, marginLeft: number, marginTop: number, maxWidth: number, lineHeight: number): void {
        let space: string = ' ';
        let words: string[] = text.split(space);
        let countWords: number = words.length;
        let line: string = '';
        for (let n: number = 0; n < countWords; n++) {
            let testLine: string = line + words[n] + space;
            let testWidth: number = context.measureText(testLine).width;
            if (testWidth > maxWidth) {
                context.fillText(line, marginLeft, marginTop);
                line = words[n] + space;
                marginTop += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        context.fillText(line, marginLeft, marginTop);
    }

    private drawIcon(ctx: any): void {
        const iconImage: { src: Buffer } = new Image();
        iconImage.src = this.loadAsset('icons', this.currentWeather.weatherIcon.concat('.png'));
        ctx.drawImage(iconImage, (this.width - this.iconSize.width) / 2, (this.height - this.iconSize.height) / 4, this.iconSize.width, this.iconSize.height);
    }

    private getOridnal(d: number): string {
        const nth: any = { '1': 'st', '2': 'nd', '3': 'rd' };
        return `${d}${nth[d] || 'th'}`;
    } 

    private loadFont(family: string, ...font: string[]): void {
        let paths: string[] = [__dirname];
        let file: string = path.join.apply(null, paths.concat('..', 'assets', 'weather', font));
        Canvas.registerFont(file, { family: family });
    }

    private loadAsset(...asset: string[]): Buffer {
        let paths: string[] = [__dirname];
        let file: string = path.join.apply(null, paths.concat('..', 'assets', 'weather', asset));
        return fs.readFileSync(file);
    }
}