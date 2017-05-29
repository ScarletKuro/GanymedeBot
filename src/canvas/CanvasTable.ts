
const Canvas: any = require('canvas');
const Image: any = Canvas.Image;
const GRAPH_LINE_COLOR: string = 'rgb(217, 217, 217)';
const UI_TEXT_COLOR: string = 'rgb(0, 0, 0)';

export class CanvasTable {
  private items: any;
  private readonly rows: number;
  private readonly cols: number;
  private readonly itemHeight: number;
  private readonly itemWidth: number;
  private readonly element: { width: number, height: number };
  private readonly context: any;

  public constructor(ctx: any, itemWidth: number, itemHeight: number, cols: number, rows: number) {
    this.element = { width: itemWidth * cols, height: itemHeight * rows };
    this.context = ctx;
    this.itemWidth = itemWidth;
    this.itemHeight = itemHeight;
    this.cols = cols;
    this.rows = rows;
    this.items = {};
  }

  public insertItem(col: number, row: number, text: string, icon: any, bottomtext: string): void {
    this.items[row * this.cols + col] = {
      col: col,
      row: row,
      text: text,
      icon: icon,
      bottomtext: bottomtext
    };
  }

  private drawGrid(): void {
    this.context.beginPath();
    for (let x: number = 0; x <= this.itemWidth * this.cols; x += this.itemWidth) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.itemHeight * this.rows);
    }
    this.context.lineWidth = 1;
    this.context.strokeStyle = GRAPH_LINE_COLOR;
    this.context.stroke();
  }

  private drawItem(item: { col: number, row: number, text: string, icon: any, bottomtext: string }): void {
    let mid: { x: number, y: number } = { x: item.col * this.itemWidth + this.itemWidth / 2, y: item.row * this.itemHeight + this.itemHeight / 2};
    let iconmid: { x: number, y: number } = { x: mid.x - (mid.x - item.col * this.itemWidth) / 2, y: mid.y - (mid.y - item.row * this.itemHeight) / 2};
    this.context.font = '12px Goulong';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = UI_TEXT_COLOR;
    this.context.fillText(item.text, mid.x, this.context.measureText(item.text).actualBoundingBoxDescent);
    this.context.drawImage(item.icon, iconmid.x, iconmid.y, 25, 25);
    this.context.fillText(item.bottomtext, mid.x, + this.itemHeight - this.context.measureText(item.bottomtext).actualBoundingBoxDescent);
  }

  public draw(x: number, y: number): void {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, x, y);
    this.drawGrid();
    for (let key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        this.drawItem(this.items[key]);
      }
    }

    this.context.restore();
  }
}
