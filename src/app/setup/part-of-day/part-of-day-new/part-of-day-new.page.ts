import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PartOfDay } from '../../../models';
import { FunctionlData } from '../../../providers/function-data';
import { ConferenceData } from '../../../providers/conference-data';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserData } from '../../../providers/user-data';

@Component({
  selector: 'part-of-day-new',
  templateUrl: './part-of-day-new.page.html',
  styleUrls: ['./part-of-day-new.page.scss'],
})
export class PartOfDayNewPage implements OnInit {
  header = 'Part Of Day';
  PODs: PartOfDay[] = [];
  newPODs: PartOfDay[] = [];
  title = '';
  timeFrom: string;
  timeTo: string;
  len: number;

  constructor(private cdRef: ChangeDetectorRef,
              private alertCtrl: AlertController,
              private funProvider: FunctionlData,
              private userProvider: UserData,
              private confProvider: ConferenceData,
              private router: Router) { }

  ngOnInit() {
    this.userProvider.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      } else {
        this.confProvider.getPartsOfDay().subscribe(data => this.PODs = data);
        this.setInitialValue();
      }
    });
  }

  setInitialValue() {
    this.title = '';
    this.len = this.newPODs.length;
    if (this.len === 0) {
      this.timeFrom = '00:00';
    } else {
      this.timeFrom = this.funProvider.addMinute(this.newPODs[this.len - 1].timeTo);
    }
    this.timeTo = this.funProvider.addMinute(this.timeFrom);
  }

  cancelInput() {
    this.setInitialValue();
  }

  saveInput() {
    if (this.isTheValueUsed()) {
      this.funProvider.onError(this.header, 'Description is not valid. Try again');
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
      this.funProvider.onError(this.header, 'Wrong time for To. Try again.');
      this.timeTo = this.funProvider.addMinute(this.timeFrom);
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
            this.confProvider.changePartsOfDay(this.PODs, this.newPODs);
            this.router.navigateByUrl('setup/tabs/(partofday:partofday)');
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }
}
