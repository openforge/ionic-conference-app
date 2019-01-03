import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsSetupPage } from './tabs-setup.page';
import { SessionsSetup } from '../sessions/sessions-setup';
import { SpeakersSetup } from '../speakers/speakers-setup';
import { TracksSetup } from '../tracks/tracks-setup';
import { MapSetup } from '../map/map-setup';
import { SupportSetup } from '../support/support-setup';
import { PartOfDaySetup } from '../part-of-day/part-of-day-setup';

const routes: Routes = [
  {
    path: 'tabs', component: TabsSetupPage,
    children: [
      // tab one
      {
        path: 'sessions',
        component: SessionsSetup,
        outlet: 'sessions'
      },
      // tab two
      {
        path: 'speakers',
        component: SpeakersSetup,
        outlet: 'speakers'
      },
      // tab three
      {
        path: 'tracks',
        component: TracksSetup,
        outlet: 'tracks'
      },
      // tab four
      {
        path: 'partofday',
        component: PartOfDaySetup,
        outlet: 'partofday'
      },
      // tab five
      {
        path: 'map',
        component: MapSetup,
        outlet: 'map'
      },
      // tab six
      {
        path: 'support',
        component: SupportSetup,
        outlet: 'support'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsSetupRoutingModule { }
