import { Component } from '@angular/core';
import { WheelConfig } from './wheel.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'croco-wheel';
  prizeWinned: any;
  selectedPrize: string = 'random';
  prizes = WheelConfig.prizes;

  public selectPrize(ev: any) { }

  public prizeWon(ev: any) {
    this.prizeWinned = undefined;
    setTimeout(() => {
      this.prizeWinned = this.prizes.find( prize => prize.id == ev);
    }, 1);
  }
}
