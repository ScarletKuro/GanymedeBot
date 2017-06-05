import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

const Canvas: any = require('canvas');
const Image: any = Canvas.Image;

const SPRITE_HEIGHT: number = 45;
const SPRITE_WIDTH: number = 26.25;

export class CanvasClock {
    private readonly time: Date;
    private readonly context: any;
    private readonly height: number;
    private readonly width: number;
    private readonly clockface: { src: Buffer } = new Image();
    private readonly positions: Array<number>;

    public constructor(time: Date, ctx: any, width: number, height: number, hhmmgapsize: number) {
        this.time = time;
        this.context = ctx;
        this.height = height;
        this.width = width;
        this.clockface.src = this.loadAsset('flip_clock.png');

        this.positions = Array(this.width * 0,
            this.width * 1,
            (this.width * 2) + hhmmgapsize,
            (this.width * 3) + hhmmgapsize);
    }

    private drawHHMMDigit(time: any, unit: number): void {
        this.context.imageSmoothingEnabled = true;
        this.context.filter = 'bilinear';
        this.context.patternQuality = 'bilinear';
        this.context.antialias = 'subpixel';
        this.context.drawImage(this.clockface, time.substr(unit, 1) * SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, this.positions[unit], 0, this.width, this.height);
    }

    public draw(x: number, y: number): void {
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, x, y);

        const timestring: string = moment.utc(this.time).format('HHmm');

        for (let iDigit: number = 0; iDigit < 4; iDigit++) {
            this.drawHHMMDigit(timestring, iDigit);
        }

        this.context.restore();
    }

    private loadAsset(...asset: string[]): Buffer {
        let paths: string[] = [__dirname];
        let file: string = path.join.apply(null, paths.concat('..', 'assets', 'clock', asset));
        return fs.readFileSync(file);
    }
}
