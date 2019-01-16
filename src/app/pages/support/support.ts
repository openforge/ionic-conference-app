import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { AlertController, ToastController } from '@ionic/angular';
import { UserData } from '../../providers/user-data';
import { SupportData } from '../../providers/support-data';

@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
  styleUrls: ['./support.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SupportPage {
  isLoggedIn = false;
  submitted = false;
  supportMessage: string;

  constructor(public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private userData: UserData,
              private supportData: SupportData,
              public storage: Storage) {
  }

  async ionViewDidEnter() {
    this.userData.isLoggedIn()
      .then(res => this.isLoggedIn = res);
  }

  async submit(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.supportData.addSupport(this.supportMessage);
      this.supportMessage = '';
      this.submitted = false;
      const toast = await this.toastCtrl.create({
        message: 'Your support request has been sent.',
        duration: 3000
      });
      await toast.present();
    }
  }
}
