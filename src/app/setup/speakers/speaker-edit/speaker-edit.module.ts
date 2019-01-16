import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { SpeakerEditPage } from './speaker-edit.page';
import { UploadImgComponent } from '../../upload-image/upload-img.page';
import { DropzoneDirective } from '../../../directive/dropzone.directive';
import { FilesizePipe } from '../../../pipe/filesize.pipe';

const routes: Routes = [
  {
    path: '',
    component: SpeakerEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SpeakerEditPage,
    DropzoneDirective,
    FilesizePipe,
    UploadImgComponent
  ]
})
export class SpeakerEditPageModule {}
