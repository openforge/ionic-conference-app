import { Component, OnInit } from '@angular/core';
import { UserData } from '../../providers/user-data';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'sessions',
  templateUrl: './sessions-setup.html',
  styleUrls: ['./sessions-setup.scss'],
})
export class SessionsSetup implements OnInit {

  constructor(private userData: UserData,
              public menu: MenuController,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.userData.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      }
    });
    // this.menu.enable(false);
  }

  ionViewDidLeave() {
    // this.menu.enable(true);
  }
}
