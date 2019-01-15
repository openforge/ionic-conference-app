import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { SessionData } from '../../providers/session-data';

import { Session } from '../../models';

@Component({
  selector: 'sessions',
  templateUrl: './sessions-setup.html',
  styleUrls: ['./sessions-setup.scss'],
})
export class SessionsSetup implements OnInit {

  startDate = '2000-01-01';
  endDate = '2019-01-31';
  queryText = '';
  sessions: Session[];

  constructor(private userProvider: UserData,
              private sessionProvider: SessionData,
              private alertCtrl: AlertController,
              private router: Router) { }

  ngOnInit() {
    this.userProvider.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      } else {
        this.sessionProvider.getSessionsInPeriod(this.startDate, this.endDate)
          .subscribe(data => {
            this.sessions = data;
          });
      }
    });
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
            // this.sessionProvider.removeSession(session);
            this.router.navigateByUrl('setup/tabs/(sessions:sessions)');
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }
}
