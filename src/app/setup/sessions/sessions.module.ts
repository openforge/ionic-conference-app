import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SessionsSetup } from './sessions-setup';
import { PickSpeakersPage } from './pick-speakers/pick-speakers.page';
import { PickTracksPage } from './pick-tracks/pick-tracks.page';

const routes: Routes = [
  {
    path: '',
    component: SessionsSetup
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SessionsSetup, PickSpeakersPage, PickTracksPage],
  entryComponents: [PickSpeakersPage, PickTracksPage]
})
export class SessionsSetupModule {}
