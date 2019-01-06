import { Component } from '@angular/core';
import { SpeakerData } from '../../providers/speaker-data';
import { Speaker } from '../../models';

@Component({
  selector: 'speakers-setup',
  templateUrl: './speakers-setup.html',
  styleUrls: ['./speakers-setup.scss'],
})
export class SpeakersSetup {

  speakers: Speaker[];
  queryText = '';

  constructor(private speakerProvider: SpeakerData) { }

  ionViewDidEnter() {
    this.speakerProvider.getSpeakers().subscribe(data => {
      this.speakers = data;
    });
  }
}
