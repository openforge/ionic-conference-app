import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FunctionlData } from '../../providers/function-data';

@Component({
  selector: 'date-period',
  templateUrl: './date-period.page.html',
  styleUrls: ['./date-period.page.scss'],
})
export class DatePeriodPage implements OnInit {

  start: string;
  end: string;
  minYear: string;
  maxYear: string;

  constructor(private navParams: NavParams,
              private modalCtrl: ModalController,
              private cdRef: ChangeDetectorRef,
              private funProvider: FunctionlData) { }

  ngOnInit() {
    this.start = this.navParams.get('start');
    this.end = this.navParams.get('end');
    this.minYear = '' + (+this.start.substring(0, 4) - 20);
    this.maxYear = '' + (+this.end.substring(0, 4) + 20);
  }

  checkStartDate(value) {
    this.cdRef.detectChanges();
    if (this.funProvider.checkDateValidation(value)) {
      this.end = (this.end < value) ? value : this.end;
    } else {
      this.funProvider.onError('Confirm Date', 'The date is not valid. Try again.');
      this.start = this.navParams.get('start');
    }
  }

  checkEndDate(value) {
    this.cdRef.detectChanges();
    if (!this.funProvider.checkDateValidation(value)) {
      this.funProvider.onError('Confirm Date', 'The date is not valid. Try again.');
      this.end = this.start;
    } else if (this.start > value) {
      this.funProvider.onError('Confirm Date', 'The end of period is wrong. Try again.');
      this.end = this.start;
    }
  }

  applySelection() {
    this.modalCtrl.dismiss({ start: this.start, end: this.end });
  }

  onExit() {
    this.modalCtrl.dismiss(null);
  }
}
