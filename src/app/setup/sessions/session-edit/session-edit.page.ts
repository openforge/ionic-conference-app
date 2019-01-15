import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Session, Track, Speaker } from '../../../models';
import { SessionData } from '../../../providers/session-data';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionlData } from '../../../providers/function-data';
import { SpeakerData } from '../../../providers/speaker-data';
import { ConferenceData } from '../../../providers/conference-data';
import { ModalController } from '@ionic/angular';
import { PickSpeakersPage } from '../pick-speakers/pick-speakers.page';

@Component({
  selector: 'session-edit',
  templateUrl: './session-edit.page.html',
  styleUrls: ['./session-edit.page.scss'],
})
export class SessionEditPage implements OnInit {

  mode: string;
  id: string;
  session: Session;
  minYear: string;
  maxYear: string;
  tracks: Track[];
  speakers: Speaker[];
  s_tracks: { name: string, isChecked: boolean }[] = [];
  moreSpeakers = false;

  constructor(private activatedRoute: ActivatedRoute,
              private cdRef: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private sessionProvider: SessionData,
              private speakerProvider: SpeakerData,
              private confProvider: ConferenceData,
              private funProvider: FunctionlData,
              private router: Router) { }

  ngOnInit() {
    this.mode = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.mode === 'New') {
      const today = new Date();
      this.minYear = '' + (today.getFullYear() - 20);
      this.maxYear = '' + (+this.minYear + 40);
      this.session = {
        name: '',
        date: this.funProvider.getDateFormat(),         // 2018-12-06
        timeStart: '10:00',    // 15:30 for 3:30pm
        timeEnd: '10:00',
        location: '',
        description: '',
        speakerIDs: [],   // speaker's id
        tracks: [],   //  name of track
      };
    } else {
      [this.id, this.mode] = [this.mode, 'Edit'];
      this.sessionProvider.getSession(this.id).then(data => {
        this.session = data;
        this.session.id = this.id;
        this.minYear = '' + (+data.date.slice(0, 4) - 5);
        this.maxYear = '' + (+this.minYear + 15);
      });
    }
    this.getSpeakersTracks();
  }

  getSpeakersTracks() {
    this.speakerProvider.getSpeakers().subscribe(data => {
      this.speakers = data;
    });

    this.confProvider.getTracks().subscribe(data => {
      this.tracks = data;
    });
  }

  isInSession(key: string, type: string): any {
    if (type === 'Speaker') {
      return this.session.speakerIDs.find(id => id === key);
    }
    return this.session.tracks.find(name => name === key);
  }

  onRemoveSpeaker(s_id) {
    const idx = this.session.speakerIDs.findIndex(id => id === s_id);
    if (idx > -1) {
      this.session.speakerIDs.splice(idx, 1);
    }
  }

  async selectSpeakers() {
    const modal = await this.modalCtrl.create({
      component: PickSpeakersPage,
      componentProps: { speakers: this.speakers, ids: this.session.speakerIDs }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.session.speakerIDs = data;
    }
  }

  changeTimeEnd(value) {
    this.cdRef.detectChanges();
    if (value > this.session.timeEnd) {
      this.session.timeEnd = this.funProvider.addMinute(value);
    }
  }

  confirmTimeEnd(value) {
    this.cdRef.detectChanges();
    if (value <= this.session.timeStart) {
      this.funProvider.onError('Confirm Time', 'Wrong time for To. Try again.');
      this.session.timeEnd = this.funProvider.addMinute(this.session.timeStart);
    }
  }

  onSubmit() {
    this.session.name = this.session.name.trim();
    this.session.location = this.session.location.trim();
    if (this.isValidAll()) {
      if (this.mode === 'New') {
        console.log('saved', this.session);
      } else {
        console.log('updated', this.session);
      }
      this.onExit();
    }
  }

  onExit() {
    this.router.navigateByUrl('/setup/tabs/(sessions:sessions)');
  }

  isValidAll() {
    if (this.session.name.length === 0) {
      this.funProvider.onError('Confirm Title', 'Need a Title for the session. Try again.');
      return false;
    } else if (this.session.timeEnd <= this.session.timeStart) {
      this.funProvider.onError('Confirm Time', 'TimeTo has to be later than TimeFrom. Try again.');
      return false;
    }
    return true;
  }

}
