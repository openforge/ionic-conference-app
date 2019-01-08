import { Component, OnInit } from '@angular/core';
import { SpeakerData } from '../../providers/speaker-data';
import { Speaker } from '../../models';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'speakers-setup',
  templateUrl: './speakers-setup.html',
  styleUrls: ['./speakers-setup.scss'],
})
export class SpeakersSetup implements OnInit {

  speakers: Speaker[];
  queryText = '';

  constructor(private speakerProvider: SpeakerData,
              private userProvider: UserData,
              private alertCtrl: AlertController,
              private router: Router) { }

  ngOnInit() {
    this.userProvider.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      } else {
        this.speakerProvider.getSpeakers().subscribe(data => {
          this.speakers = data;
        });
      }
    });
  }

  async onConfirmToRemove(speaker: Speaker) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Remove',
      message: `Are you sure to remove ${speaker.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.router.navigateByUrl('setup/tabs/(speaker:speaker)');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.speakerProvider.removeSpeaker(speaker);
            this.router.navigateByUrl('setup/tabs/(speaker:speaker)');
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }
}
