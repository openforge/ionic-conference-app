import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { SessionData } from '../../providers/session-data';

import { Session } from '../../models';
import { ConferenceData } from '../../providers/conference-data';
import { FunctionlData } from '../../providers/function-data';
import { PeriodPage } from '../../setup/period/period.page';

@Component({
  selector: 'sessions',
  templateUrl: './sessions-setup.html',
  styleUrls: ['./sessions-setup.scss'],
})
export class SessionsSetup implements OnInit {

  startDate = '2000-01-01';
  endDate = '2100-12-31';
  queryText = '';
  sessions: Session[];

  constructor(private userProvider: UserData,
              private sessionProvider: SessionData,
              private dataProvider: ConferenceData,
              private funProvider: FunctionlData,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private router: Router) { }

  ngOnInit() {
    this.userProvider.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      } else {
        this.dataProvider.getPeriod().then(period => {
          if (period) {
            this.startDate = period.start;
            this.endDate = period.end;
            this.getSessions();
          } else {
            this.getDatePeriod();
          }
        });
      }
    });
  }

  getSessions() {
    this.sessionProvider.getSessionsInPeriod(this.startDate, this.endDate)
      .subscribe(data => { this.sessions = data; });
  }

  async getDatePeriod() {
    const start = this.startDate ? this.startDate : this.funProvider.getDateFormat();
    const end = this.endDate ? this.endDate : start ;
    const modal = await this.modalCtrl.create({
      component: PeriodPage,
      componentProps: { start, end }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.startDate = data.start;
      this.endDate = data.end;
      this.dataProvider.setPeriod({ start: this.startDate, end: this.endDate });
      this.getSessions();
    }
  }

  async onConfirmToRemove(session: Session) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Remove',
      message: `Are you sure to remove ${session.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.router.navigateByUrl('setup/tabs/(sessions:sessions)');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.sessionProvider.removeSession(session);
            this.router.navigateByUrl('setup/tabs/(sessions:sessions)');
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }
}
