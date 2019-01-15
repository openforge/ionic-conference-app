import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { ConferenceData } from '../../providers/conference-data';
import { User, Track } from '../../models';
import { FunctionlData } from '../../providers/function-data';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignupPage implements OnInit {
  header = 'Confirm Signup';
  users: User[];
  signup: User = {
    username: '', password: '', email: '', favorites: [], trackFilter: []
  };
  tracks: Track[];
  confirmPassword = '';
  submitted = false;

  constructor(public router: Router,
              public userProvider: UserData,
              private funProvider: FunctionlData,
              public dataProvider: ConferenceData) {}

  ngOnInit() {
    this.userProvider.getUsers().subscribe(
      (data: User[]) => { this.users = data; }
    );
    this.dataProvider.getTracks().subscribe(
      (tracks: Track[]) => { this.tracks = tracks; }
    );
  }

  onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid && this.signup.password === this.confirmPassword) {
      if (this.signup.username.trim().length < 4) {
        this.funProvider.onError(this.header, 'Name should has more then 3 letters. Try again.');
      } else if (this.isNameUsed(this.signup.username)) {
        this.funProvider.onError(this.header, 'Name is already taken. Try another.');
      } else if (this.isEmailUsed(this.signup.email)) {
        this.funProvider.onError(this.header, 'Email is already taken. Try another.');
      } else {
        this.setTrackFilter();
        this.userProvider.signup(this.signup);
        this.router.navigateByUrl('/app/tabs/(speakers:speakers)');
      }
    }
  }

  setTrackFilter() {
    this.tracks.forEach(track => {
      this.signup.trackFilter.push({ name: track.name, isChecked: true });
    });
  }

  isNameUsed(name) {
    return this.users.find(ur => ur.username.toLowerCase() === name.toLowerCase());
  }

  isEmailUsed(email) {
    return this.users.find(ur => ur.email.toLowerCase() === email.toLowerCase());
  }
}
