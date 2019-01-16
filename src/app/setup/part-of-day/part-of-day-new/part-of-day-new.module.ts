import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartOfDayNewPage } from './part-of-day-new.page';

const routes: Routes = [
  {
    path: '',
    component: PartOfDayNewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PartOfDayNewPage]
})
export class PartOfDayNewPageModule {}
