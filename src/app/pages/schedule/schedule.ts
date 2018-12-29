import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ScheduleTrackPage } from '../schedule-track/schedule-track';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { User, Session, PartOfDay } from '../../models';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('scheduleList') scheduleList: List;

  user: User;
  queryText = '';
  segment = '';
  excludeTracks: any[] = [];

  start = '2019-01-10';
  end = '2019-01-15';
  changePeriod = true;

  partsOfDay: PartOfDay[];
  sessions: Session[];
  schedule: {
    date: string,
    groups: {
      indexKey: number
      partOfDay: string,
      sessions: any[]
    }[]
  }[] = [];

  constructor(
    public alertCtrl: AlertController,
    public dataProvider: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public toastCtrl: ToastController,
    public userProvider: UserData
  ) { }

  ngOnInit() {
    // this.app.setTitle('Schedule');
    this.userProvider.isLoggedIn().then(loggedIn => {
      if (loggedIn) {
        this.userProvider.getUser().then(user => {
          user.trackFilter.forEach(track => {
            if (!track.isChecked) { this.excludeTracks.push(track.name); }
          });
          this.user = user;
          this.dataProvider.getPartsOfDay().subscribe(
            response => { this.partsOfDay = response ; }
          );
          this.updateSchedule();
        });
      }
    });
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    if (this.schedule.length === 0 || this.changePeriod) {
      this.changePeriod = false;
      this.dataProvider.getSessionInPeriod(this.start, this.end).subscribe(
        (response: Session[]) => {
          this.sessions = response;
          this.buildSchedule();
      });
    }
  }

  getFilterOption() {
    return {
      queryText: this.queryText.toLowerCase().trim(),
      segment: this.segment,
      excludeTracks: this.excludeTracks
    };
  }

  buildSchedule() {
    const filterOption = this.getFilterOption();
    this.sessions.forEach(session => {
      session = this.dataProvider.filterSession(session, filterOption);
      const partOfDay = this.partsOfDay.find(part => part.timeFrom <= session.timeStart && part.timeTo >= session.timeStart);
      const newGroup = {
        indexKey: partOfDay.indexKey,
        partOfDay: partOfDay.name,
        sessions: [session]
      };
      const newItem = { date: session.date, groups: [newGroup]};

      const sIndex = this.schedule.findIndex(item => item.date === session.date);
      if (sIndex < 0) {
        this.schedule.push(newItem);
      } else {
        const gIndex = this.schedule[sIndex].groups.findIndex(
          group => group.partOfDay === partOfDay.name
        );
        if (gIndex < 0) {
          this.schedule[sIndex].groups.push(newGroup);
        } else {
          this.schedule[sIndex].groups[gIndex].sessions.push(session);
        }
      }
    });
    this.schedule.sort((a, b) => {
      if (a.date > b.date) { return 1; }
      return -1;
    });
    this.schedule.forEach(item => {
      item.groups.sort((a, b) => a.indexKey - b.indexKey);
      item.groups.forEach(group => {
        group.sessions.sort((a, b) => {
          if (a.timeStart > b.timeStart) { return 1; }
          return -1;
        });
      });
    });
  }

  updateFilter() {
    const filterOption = this.getFilterOption();
    this.schedule.forEach(daily => {
      daily.groups.forEach(group => {
        group.sessions.forEach(session => {
          session = this.dataProvider.filterSession(session, filterOption);
        });
      });
    });
  }

  processBySegment() {
    if (this.segment === 'one') {
      this.chooseTrack();
    } else if (this.segment === 'all') {
      this.excludeTracks = [];
      this.updateFilter();
    } else if (this.segment === 'favorites') {
      this.updateFilter();
    }
  }

  async chooseTrack() {
    const modal = await this.modalCtrl.create({
      component: ScheduleTrackPage,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.segment = 'user';
      this.updateFilter();
    } else {
      this.segment = '';
    }
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.segment = 'user';
      this.updateFilter();
    }
  }

  goToSessionDetail(sessionData: any) {
    // go to the session detail page
    // and pass in the session data
    this.router.navigateByUrl(`app/tabs/(schedule:session/${sessionData.id})`);
  }

async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.userProvider.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.userProvider.addFavorite(sessionData.name);

      // create an alert instance
      const alert = await this.alertCtrl.create({
        header: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      await alert.present();
    }

  }

  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.userProvider.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }
}
