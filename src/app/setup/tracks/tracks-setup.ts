import { Component, OnInit } from '@angular/core';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';
import { Track, Session } from '../../models';
import { SessionData } from '../../providers/session-data';
import { ConferenceData } from '../../providers/conference-data';
import { AlertController } from '@ionic/angular';
import { FunctionlData } from '../../providers/function-data';

@Component({
  selector: 'tracks',
  templateUrl: './tracks-setup.html',
  styleUrls: ['./tracks-setup.scss'],
})
export class TracksSetup implements OnInit {

  header = `Track's Info`;
  tracks: Track[];
  sessions: Session[];
  newName: string;
  succeed = false;
  jobDescription: string;

  constructor(private userProvider: UserData,
              private sessionProvider: SessionData,
              private confProvider: ConferenceData,
              private funProvider: FunctionlData,
              private router: Router,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.userProvider.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      } else {
        this.confProvider.getTracks().subscribe(data => {
          this.tracks = data;
          this.sessionProvider.getSessions().subscribe(session => {
            this.sessions = session;
          });
        });
      }
    });
  }

  async addNewTrack() {
    const addForm = await this.alertCtrl.create({
      header: 'Add a Track',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            data.newName = data.newName.trim();
            if (this.isTheValueUsed(data.newName)) {
              this.funProvider.onError(this.header, data.newName + ' was used already. Try another.');
            } else {
              this.confProvider.addTrack({ name: data.newName });
              this.succeed = true;
              this.jobDescription = 'A new Track has been added.';
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
    await addForm.present();
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
              this.funProvider.onError(this.header, data.newName + ' was used already. Try another.');
            } else {
              this.confProvider.updateTrack(track, data.newName );
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

  async onConfirmToRemove(track: Track) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Remove',
      message: `Are you sure to remove ${track.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.confProvider.removeTrack(track);
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  isTheValueUsed(name) {
    return this.tracks.find(track => track.name.toLowerCase() === name.toLowerCase());
  }
}
