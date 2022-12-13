import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('600ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('600ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  // tslint:disable-next-line: no-output-native
  @Output() close: EventEmitter<boolean>;

  public showDetail: boolean;

  constructor() {
    this.close = new EventEmitter<boolean>();
    this.showDetail = true;
  }

  ngOnInit() {
  }

  /**
   * Close detail
   */
  closeDetail(): void {
    // Frame no longer see the detail
    this.showDetail = false;
    // Give the window time to close
    setTimeout(() => {
      // Send the event to close
      this.close.emit(false);
    }, 600);
  }
}
