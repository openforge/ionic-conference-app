import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Speaker } from '../../../models';
import { SpeakerData } from '../../../providers/speaker-data';
import { FunctionlData } from '../../../providers/function-data';

@Component({
  selector: 'speaker-edit',
  templateUrl: './speaker-edit.page.html',
  styleUrls: ['./speaker-edit.page.scss'],
})
export class SpeakerEditPage implements OnInit {

  header = `Speaker's Info`;
  mode: string;
  id: string;
  speaker: Speaker;
  loadImage = false;
  currentUrl = '';

  constructor(private activatedRoute: ActivatedRoute,
              private speakerProvider: SpeakerData,
              private funProvider: FunctionlData,
              private router: Router) { }

  ngOnInit() {
    this.mode = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.mode === 'New') {
      this.speaker = {
        name: '',
        profilePic: '',
        twitter: '',
        github: '',
        instagram: '',
        about: '',
        location: '',
        email: '',
        phone: '',
        sessions: [],
      };
    } else {
      [this.id, this.mode] = [this.mode, 'Edit'];
      this.speakerProvider.getSpeaker(this.id).then(data => {
        this.speaker = data;
        this.speaker.id = this.id;
        // to keep profile's path as string.
        this.currentUrl = data.profilePic;
      });
    }
  }

  onSubmit() {
    if (this.verifiedInput()) {
      if (this.mode === 'New') {
        this.speakerProvider.addNewSpeaker(this.speaker);
      } else {
        // to reassign it's origin path as string.
        this.speaker.profilePic = this.currentUrl;
        this.speakerProvider.updateSpeaker(this.speaker);
      }
      this.router.navigateByUrl('/setup/tabs/(speaker:speaker)');
    }
  }

  verifiedInput() {
    this.speaker.name = this.speaker.name.trim() ;
    this.speaker.profilePic = this.speaker.profilePic.trim() ;
    this.speaker.email = this.speaker.email.trim() ;
    this.speaker.phone = this.speaker.phone.trim() ;
    this.speaker.github = this.speaker.github.trim();
    this.speaker.instagram = this.speaker.instagram.trim() ;
    this.speaker.location = this.speaker.location.trim() ;
    this.speaker.twitter = this.speaker.twitter.trim() ;
    this.speaker.about = this.speaker.about.trim() ;
    if (this.speaker.name.length < 4) {
      this.funProvider.onError(this.header, 'Name should be more than 3 digits.');
    } if (this.isNameUsed()) {
      this.funProvider.onError(this.header, 'Name already exist. Try another.');
    } if (this.isEmailUsed()) {
      this.funProvider.onError(this.header, 'Email is not valid. Try another.');
    } if (this.speaker.phone.length < 10) {
      this.funProvider.onError(this.header, 'Phone number is not valid. Try again.');
    } else {
      return true;
    }
    return false;
  }

  isNameUsed() {
    // check validation of name
    return false;
  }

  isEmailUsed() {
    // check validation of email
    return false;
  }

  onExit() {
    this.router.navigateByUrl('/setup/tabs/(speaker:speaker)');
  }

  updatePicture(path: string) {
    const oldUrl = this.speaker.profilePic;
    const id = this.speaker.id;
    this.speaker.profilePic = path;
    this.speakerProvider.updateSpeaker(this.speaker);
    this.loadImage = false;
    this.router.navigateByUrl('/setup/tabs/(speaker:speaker)');
  }

  onLoadImage() {
    this.loadImage = (this.mode === 'New') ? false : true;
  }
}
