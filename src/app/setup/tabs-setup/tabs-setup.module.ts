import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsSetupPage } from './tabs-setup.page';
import { TabsSetupRoutingModule } from './tabs-setup-routing.module';
import { SessionsSetupModule } from '../sessions/sessions.module';
import { SpeakersSetupModule } from '../speakers/speakers.module';
import { TracksSetupModule } from '../tracks/tracks.module';
import { MapSetupModule } from '../map/map.module';
import { SupportSetupModule } from '../support/support.module';
import { PartOfDaySetupModule } from '../part-of-day/part-of-day.module';
import { PartOfDayNewPageModule } from '../part-of-day/part-of-day-new/part-of-day-new.module';

const routes: Routes = [
  {
    path: '',
    component: TabsSetupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionsSetupModule,
    SpeakersSetupModule,
    TracksSetupModule,
    PartOfDaySetupModule,
    PartOfDayNewPageModule,
    MapSetupModule,
    SupportSetupModule,
    TabsSetupRoutingModule
  ],
  declarations: [
    TabsSetupPage
  ]
})
export class TabsSetupPageModule {}
