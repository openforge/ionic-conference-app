import { Component, OnInit } from '@angular/core';
import { UserData } from '../../providers/user-data';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage implements OnInit {
  loggedIn = false;

  constructor(private userProvide: UserData) {}

  ngOnInit() {
    this.userProvide.isLoggedIn().then(data => {
      this.loggedIn = data;
    });
  }
}
