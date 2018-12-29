import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AccountPage } from './account';
import { AccountPageRoutingModule } from './account-routing.module';
import { UploadImageComponent } from '../upload-image/upload-image.component';
import { FileSizePipe } from '../../pipe/file-size.pipe';
import { DropZoneDirective } from '../../directive/drop-zone.directive';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AccountPageRoutingModule
  ],
  declarations: [
    AccountPage,
    UploadImageComponent,
    FileSizePipe,
    DropZoneDirective
  ]
})
export class AccountModule { }
