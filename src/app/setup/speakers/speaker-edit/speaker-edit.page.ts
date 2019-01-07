import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Speaker } from '../../../models';
import { SpeakerData } from '../../../providers/speaker-data';

@Component({
  selector: 'speaker-edit',
  templateUrl: './speaker-edit.page.html',
  styleUrls: ['./speaker-edit.page.scss'],
})
export class SpeakerEditPage implements OnInit {

  mode: string;
  id: string;
  speaker: Speaker;
  loadImage = false;
  currentUrl = '';
  newPath = '';

  constructor(private activatedRoute: ActivatedRoute,
              private speakerData: SpeakerData,
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
      this.speakerData.getSpeaker(this.id).then(data => {
        this.speaker = data;
        this.speaker.id = this.id;
        this.currentUrl = data.profilePic;
        this.newPath = this.currentUrl;
      });
    }
  }

  onSubmit() {
    if (this.verifiedInput()) {
      if (this.mode === 'New') {
        this.speakerData.addNewSpeaker(this.speaker);
      } else {
        this.speakerData.updateSpeaker(this.speaker);
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
      alert('Name should be more than 4 digits.');
    } if (this.isNameUsed()) {
      alert('Name already exist. Try another.');
    } if (this.isEmailUsed()) {
      alert('Email is not valid. Try another.');
    } if (this.speaker.phone.length < 10) {
      alert('Phone number is not valid. Try again.');
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
    this.speakerData.updateSpeaker(this.speaker);
    this.loadImage = false;
    this.router.navigateByUrl('/setup/tabs/(speaker:speaker)');
  }

  onLoadImage() {
    this.loadImage = (this.mode === 'New') ? false : true;
  }
}
