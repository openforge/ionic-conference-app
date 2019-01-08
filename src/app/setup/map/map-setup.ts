import { Component, OnInit } from '@angular/core';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';

@Component({
  selector: 'map-setup',
  templateUrl: './map-setup.html',
  styleUrls: ['./map-setup.scss'],
})
export class MapSetup implements OnInit {

  constructor(private userProvider: UserData,
              private router: Router) { }

  ngOnInit() {
    this.userProvider.getUser().then(user => {
      if ( !user || user.username !== 'admin') {
        this.router.navigateByUrl('/tutorial');
      }
    });
  }

}
