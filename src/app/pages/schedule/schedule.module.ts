import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ScheduleTrackPage } from '../schedule-track/schedule-track';
import { SchedulePageRoutingModule } from './schedule-routing.module';
import { DatePeriodPage } from '../date-period/date-period.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule
  ],
  declarations: [
    SchedulePage,
    ScheduleFilterPage,
    ScheduleTrackPage,
    DatePeriodPage
  ],
  entryComponents: [
    ScheduleFilterPage,
    ScheduleTrackPage,
    DatePeriodPage
  ]
})
export class ScheduleModule { }
