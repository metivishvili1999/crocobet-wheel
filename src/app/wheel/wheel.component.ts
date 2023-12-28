import { AfterViewInit, Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Power3, TweenMax } from 'gsap';
import * as PIXI from 'pixi.js';
import { WheelConfig } from '../wheel.config';

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements AfterViewInit {

  private app!: PIXI.Application;
  private wheel!: PIXI.Container;
  private buttonContainer!: any;
  private button!: PIXI.Graphics;
  private arrow!: PIXI.Graphics;
  private appWidth = WheelConfig.appWidth;
  private appHeight = WheelConfig.appHeight;
  private circleRadius = WheelConfig.circleRadius;
  private sectorRadians = WheelConfig.sectorRadians;
  private sectionSlices = WheelConfig.sectionSlices;
  private spinning = WheelConfig.spinning;
  private wonItemSector: any;
  private loader = PIXI.Loader.shared;
  private chosenSection!: number;

  public prizeList: any[] = [];

  @Input() set prizes(val: any) {
    this.prizeList = val;
    this.sectorRadians = 2 * Math.PI / val.length;
  }

  @Input() set destination(val: any) {
    if (val !== 'random') {
      this.chosenSection = this.sectionSlices.find(sector => sector.id == val)!.num;
    } else {
      this.chosenSection = this.getRandom(0,7);
    }
  }

  @Output() prizeWon: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('game') private gameElement!: ElementRef;

  constructor() {
    this.loader.add('scooter', './assets/images/scooter.png')
               .add('pixel',   './assets/images/pixel.png')
               .add('gtr',     './assets/images/gtr.png')
               .add('house',   './assets/images/house.png');
  }

  private getRandom(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  ngAfterViewInit(): void {
    this.app = new PIXI.Application({width: this.appWidth, height: this.appHeight, backgroundAlpha: 0});
    this.wheel = new PIXI.Container();
    this.wheel.pivot.set(0, 0);
    this.wheel.position.set(300, 300);
    this.app.stage.addChild(this.wheel);
    this.createCircle();
    this.drawButton();
    this.gameElement.nativeElement.appendChild(this.app.view)
  }

  private drawButton() {
      this.buttonContainer = new PIXI.Sprite();
      this.arrow = new PIXI.Graphics();
      this.arrow.beginFill(0xffffff);
      const arrowPoints = [
        { x: 245, y: 300 },
        { x: 305, y: 260 },
        { x: 305, y: 340 }
      ];
      this.arrow.drawPolygon(arrowPoints.map(point => [point.x, point.y]).flat());
      this.arrow.endFill();
      this.buttonContainer.addChild(this.arrow);

      this.button = new PIXI.Graphics();
      this.button.beginFill(0xffffff);
      this.button.drawCircle(0, 0, 40);
      this.button.endFill();
      this.wheel.pivot.set(0, 0);
      this.button.position.set(300,300);
      this.buttonContainer.addChild(this.button);
      this.buttonContainer.interactive = true;
      this.buttonContainer.buttonMode = true;
      this.app.stage.addChild(this.buttonContainer);
      this.buttonContainer.on('pointertap', () => {
        this.toggleFiltertoContainer(false);
        this.prizeWon.emit(-1);
        this.spinWEheel();

      });
      const txt = new PIXI.Text('SPIN', {fill: '#229954',fontStyle: 'italic',
      fontWeight: 'bold',strokeThickness: 1});

      txt.anchor.set(0.5);
      txt.position.set(0,0);
      this.button.addChild(txt);
  }

  private spinWEheel() {
    if (this.spinning) return;
    this.finalPos();
  }

  private createCircle() {
    for (let i = 0; i < this.prizeList.length; i++) {
      const sectorGraphics = this.createSectorGraphics(i);
      this.wheel.addChild(sectorGraphics);

      if (this.prizeList[i].prizetype === 'text') {
        const textContainer = new PIXI.Container();
        sectorGraphics.addChild(textContainer);
        textContainer.addChild(this.createTextSector(this.prizeList[i].text, i));
      } else {
        const iconSector = this.createImgSector(this.prizeList[i].iconName, i);
        sectorGraphics.addChild(iconSector);
        sectorGraphics.lineStyle(3, 0x000000);
      }
    }
  }

  private createSectorGraphics(index: number): PIXI.Graphics {
    const sectorGraphics = new PIXI.Graphics();
    const color = this.prizeList[index].colorPIXI;
    const startingAngle = index * this.sectorRadians - this.sectorRadians / 2;
    const endingAngle = startingAngle + this.sectorRadians;

    sectorGraphics.beginFill(color);
    sectorGraphics.lineStyle(5, 0xffffff);
    sectorGraphics.moveTo(0, 0);
    sectorGraphics.arc(0, 0, this.circleRadius, startingAngle, endingAngle);
    sectorGraphics.lineTo(0, 0);

    return sectorGraphics;
  }

  private createTextSector(text: string, index: number): PIXI.Text {
    const rotation = index * this.sectorRadians;
    const textAnchorPercentage = (this.circleRadius - 150 / 2) / this.circleRadius;
    const txt = new PIXI.Text(text, {fill: '#000000'});
    txt.anchor.set(0.5, 0.5);
    txt.rotation = rotation + Math.PI;
    txt.position.set(this.circleRadius * textAnchorPercentage * Math.cos(rotation),this.circleRadius * textAnchorPercentage * Math.sin(rotation));
    return txt;
  }


  private finalPos() {
    this.spinning = true;
    TweenMax.to(this.wheel, 1, {
      rotation: (this.chosenSection / this.prizeList.length) * Math.PI * 2 + Math.PI / 2,
      ease: Power3.easeInOut,
      repeat: 3,
      repeatRefresh: true,
      direction: -1,
      onComplete: () => {
        this.spinning = false;
        this.handleFinalPos();
      }
    });
  }

  private handleFinalPos(): void {
    const selectedElement = this.sectionSlices.find(sector => sector.num === this.chosenSection);
    const selectedPrize = this.prizeList.find(prize => prize.id === selectedElement?.id);
    const selectedElementValue = selectedPrize?.text;
    const selectedElementIcon = selectedPrize?.iconName;

    for (let i = 0; i < this.wheel.children.length; i++) {
      const element: any = this.wheel.children[i];

      if (selectedElement?.isText == true && selectedElementValue !== undefined) {
        if (element.children[0].children[0]['_text'] === selectedElementValue) {
          this.wonItemSector = element;
          this.toggleFiltertoContainer(true);
        }
      } else if (selectedElement?.isText == false && selectedElementIcon !== undefined) {
        this.wonItemSector = element.getChildByName(selectedElementIcon)?.parent;
        if (this.wonItemSector) {
          this.toggleFiltertoContainer(true);
        }
      }
    }

    this.prizeWon.emit(selectedElement?.id);
  }

  private toggleFiltertoContainer(add: boolean) {
    const elements: any = this.wheel.children;
    if (add) {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element !== this.wonItemSector) {
          const opac = new PIXI.filters.AlphaFilter();
          opac.alpha = 0.3;
          element.filters = [opac];
        }
      }
    } else {
      for (let i = 0; i < elements.length; i++) {
        elements[i].filters = [];
        this.wonItemSector = undefined;
      }
    }
  }

  private createImgSector(img: string, index: number): PIXI.Container {
    const rotation = index * this.sectorRadians;
    const tmpSector: any = new PIXI.Container();
    tmpSector.name = img;
    const image = PIXI.Sprite.from(`./assets/images/${img}.png`);
    image.scale.set(0.7);
    image.anchor.set(0.5);
    image.rotation = rotation + Math.PI;
    image.position.set((this.circleRadius - 120 / 2) * Math.cos(rotation),(this.circleRadius - 120 / 2) * Math.sin(rotation));
    tmpSector.addChild(image);
    return tmpSector;
  }
}
