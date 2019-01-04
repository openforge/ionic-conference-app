import { Component } from '@angular/core';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';
import { Track, Session } from '../../models';
import { SessionData } from '../../providers/session-data';
import { ConferenceData } from '../../providers/conference-data';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'tracks',
  templateUrl: './tracks-setup.html',
  styleUrls: ['./tracks-setup.scss'],
})
export class TracksSetup {

  tracks: Track[];
  sessions: Session[];
  newName: string;
  succeed = false;
  jobDescription: string;

  constructor(private userData: UserData,
              private sessionData: SessionData,
              private confData: ConferenceData,
              private router: Router,
              private alertCtrl: AlertController) { }

  ionViewWillEnter() {
    this.userData.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      } else {
        this.confData.getTracks().subscribe(data => {
          this.tracks = data;
          this.sessionData.getSessions().subscribe(session => {
            this.sessions = session;
          });
        });
      }
    });
  }

  ionViewDidLeave() {}

  onAddNew() {
    console.log('add a new track');
  }

  async changeName(track) {
    this.succeed = false;
    const changeForm = await this.alertCtrl.create({
      header: 'Change Track',
      subHeader: track.name,
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            data.newName = data.newName.trim();
            if (this.isTheValueUsed(data.newName)) {
              alert(data.newName + ' was used already. Try another.');
            } else {
              this.confData.updateTrack(track, data.newName );
              this.succeed = true;
              this.jobDescription = 'Name has been changed.';
            }
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'newName',
          placeholder: 'new name here'
        }
      ],
      backdropDismiss: false
    });
    await changeForm.present();
  }

  onRemove(track) {
    if (confirm(`Are you sure to delete '${track.name}'?`)) {
      this.confData.removeTrack(track);
    }
  }

  isTheValueUsed(name) {
    return this.tracks.find(track => track.name.toLowerCase() === name.toLowerCase());
  }
}
