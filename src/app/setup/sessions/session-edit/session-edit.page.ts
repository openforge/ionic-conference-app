import { Component, OnInit } from '@angular/core';
import { Session } from '../../../models';
import { SessionData } from '../../../providers/session-data';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'session-edit',
  templateUrl: './session-edit.page.html',
  styleUrls: ['./session-edit.page.scss'],
})
export class SessionEditPage implements OnInit {

  mode: string;
  id: string;
  session: Session;

  constructor(private activatedRoute: ActivatedRoute,
              private sessionProvider: SessionData,
              private router: Router) { }

  ngOnInit() {
    this.mode = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.mode === 'New') {
      this.session = {
        name: '',
        date: '',         // 2018-12-06
        timeStart: '',    // 15:30 for 3:30pm
        timeEnd: '',
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
      });
    }
  }

  onExit() {
    this.router.navigateByUrl('/setup/tabs/(sessions:sessions)');
  }

}
