import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PartOfDay } from '../../../models';
import { FunctionlData } from '../../../providers/function-data';
import { ConferenceData } from '../../../providers/conference-data';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'part-of-day-new',
  templateUrl: './part-of-day-new.page.html',
  styleUrls: ['./part-of-day-new.page.scss'],
})
export class PartOfDayNewPage implements OnInit {

  PODs: PartOfDay[] = [];
  newPODs: PartOfDay[] = [];
  title = '';
  timeFrom: string;
  timeTo: string;
  len: number;

  constructor(private cdRef: ChangeDetectorRef,
              private alertCtrl: AlertController,
              private funProvider: FunctionlData,
              private confData: ConferenceData,
              private router: Router) { }

  ngOnInit() {
    this.confData.getPartsOfDay().subscribe(data => this.PODs = data);
    this.setInitialValue();
  }

  setInitialValue() {
    this.title = '';
    this.len = this.newPODs.length;
    if (this.len === 0) {
      this.timeFrom = '00:00';
    } else {
      this.timeFrom = this.getNextTime(this.newPODs[this.len - 1].timeTo);
    }
    this.timeTo = this.getNextTime(this.timeFrom);
  }

  getNextTime(time) {
    const [h, m] = time.split(':');
    const hour = this.funProvider.reform2digits((m === '59') ? +h + 1 : +h);
    const min = this.funProvider.reform2digits((m === '59') ? 0 : +m + 1);
    return (hour === '24') ? null : hour + ':' + min ;
  }

  cancelInput() {
    this.setInitialValue();
  }

  saveInput() {
    if (this.isTheValueUsed()) {
      alert('Description is not valid. Try again');
    } else {
      const newPOD = {
        indexKey: this.newPODs.length + 1,
        name: this.title,
        timeFrom: this.timeFrom,
        timeTo: this.timeTo
      } as PartOfDay;
      this.newPODs.push(newPOD);
      if (this.timeTo === '23:59') {
        this.presentConfirm();
      } else {
        this.setInitialValue();
      }
    }
  }

  isTheValueUsed() {
    this.title = this.title.trim();
    if (this.title === '') {
      return true;
    }
    return this.PODs.find(pod => pod.name.toLowerCase() === this.title.toLowerCase());
  }

  checkTimeTo(value) {
    this.cdRef.detectChanges();
    if (value <= this.timeFrom) {
      alert('Wrong time for To. Try again.');
      this.timeTo = this.getNextTime(this.timeFrom);
    }
  }

  async presentConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Save',
      message: 'Done the job. Do you want to save it?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.router.navigateByUrl('setup/tabs/(partofday:partofday)');
          }
        },
        {
          text: 'Save',
          handler: () => {
            this.confData.changePartsOfDay(this.PODs, this.newPODs);
            this.router.navigateByUrl('setup/tabs/(partofday:partofday)');
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }
}
