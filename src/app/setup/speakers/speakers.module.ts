import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SpeakersSetup } from './speakers-setup';

const routes: Routes = [
  {
    path: '',
    component: SpeakersSetup
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SpeakersSetup]
})
export class SpeakersSetupModule {}
