import { Component, OnInit } from '@angular/core';
import { PartOfDay } from '../../models';
import { ConferenceData } from '../../providers/conference-data';
import { Router } from '@angular/router';

@Component({
  selector: 'part-of-day',
  templateUrl: './part-of-day-setup.html',
  styleUrls: ['./part-of-day-setup.scss'],
})
export class PartOfDaySetup implements OnInit {

  PODs: PartOfDay[];

  constructor(private confData: ConferenceData,
              private router: Router) { }

  ngOnInit() {
    this.confData.getPartsOfDay().subscribe(data => {
      this.PODs = data;
    });
  }

  makeNewPOD() {
    console.log('open new file here');
    // this.router.navigateByUrl('setup/tabs/(partofday:new)')
  }
}
