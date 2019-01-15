import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FunctionlData {

  constructor(private alertCtrl: AlertController) {}

  async onError(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          handler: () => {
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  getDateFormat(date?: Date) {
    if (!date) {
      date = new Date();
    }
    const dateArray = date.toLocaleDateString().split('/');
    return dateArray[2] + '-' +
           this.reform2digits(dateArray[0]) + '-' +
           this.reform2digits(dateArray[1]);
  }

  // change date format : USA <-> EU
  changeDateFormat(date: string) {
    const arr = date.split('-');
    if (arr[0].length > 3) {
      return `${arr[1]}-${arr[2]}-${arr[0]}`;
    }
    return `${arr[2]}-${arr[0]}-${arr[1]}`;
  }

  getAmPmTimeFormat(time: string): string {
    if (!time) { return '00:00 am' ; }
    let t = +time.split(':')[0];
    let m = time.split(':')[1];
    if (t > 11) {
      m = m + ' pm';
      t = (t === 12) ? t : t - 12 ;
    } else {
      m = m + ' am';
    }
    return this.reform2digits(t) + ':' + m ;
  }

  get24HoursFormat(time: string): string {
    if (!time) { return '' ; }
    const data = time.split(' ');
    let t = +data[0].split(':')[0];
    const m = data[0].split(':')[1];
    if (data[1] === 'pm' && t < 12)  { t = t + 12 ; }
    const realTime = (t < 10 ? '0' : '') + t;
    return realTime + ':' + m ;
  }

  reform2digits(value): string {
    value = +value;
    return ((value < 10) ? '0' : '') + value ;
  }

  addMinute(time) {
    const [h, m] = time.split(':');
    const hour = this.reform2digits((m === '59') ? +h + 1 : +h);
    const min = this.reform2digits((m === '59') ? 0 : +m + 1);
    return (hour === '24') ? null : hour + ':' + min ;
  }
}
