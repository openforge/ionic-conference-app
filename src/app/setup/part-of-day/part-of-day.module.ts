import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartOfDaySetup } from './part-of-day-setup';

const routes: Routes = [
  {
    path: '',
    component: PartOfDaySetup
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PartOfDaySetup]
})
export class PartOfDaySetupModule {}
