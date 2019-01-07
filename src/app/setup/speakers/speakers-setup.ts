import { Component } from '@angular/core';
import { SpeakerData } from '../../providers/speaker-data';
import { Speaker } from '../../models';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'speakers-setup',
  templateUrl: './speakers-setup.html',
  styleUrls: ['./speakers-setup.scss'],
})
export class SpeakersSetup {

  speakers: Speaker[];
  queryText = '';

  constructor(private speakerProvider: SpeakerData,
              private alertCtrl: AlertController,
              private router: Router) { }

  ionViewDidEnter() {
    this.speakerProvider.getSpeakers().subscribe(data => {
      this.speakers = data;
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
