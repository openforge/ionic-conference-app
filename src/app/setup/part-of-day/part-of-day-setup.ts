import { Component, OnInit } from '@angular/core';
import { PartOfDay } from '../../models';
import { ConferenceData } from '../../providers/conference-data';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FunctionlData } from '../../providers/function-data';

@Component({
  selector: 'part-of-day',
  templateUrl: './part-of-day-setup.html',
  styleUrls: ['./part-of-day-setup.scss'],
})
export class PartOfDaySetup implements OnInit {

  PODs: PartOfDay[];

  constructor(private confData: ConferenceData,
              private alertCtrl: AlertController,
              private funProvider: FunctionlData,
              private router: Router) { }

  ngOnInit() {
    this.confData.getPartsOfDay().subscribe(data => {
      this.PODs = data;
    });
  }

  makeNewPOD() {
    this.router.navigateByUrl('setup/tabs/(partofday:new)');
  }

  async editTitle(pod) {
    const changeForm = await this.alertCtrl.create({
      header: 'Change Description',
      subHeader: pod.name,
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            data.newName = data.newName.trim();
            if (this.isTheValueUsed(data.newName)) {
              this.funProvider.onError('Part Of Day', data.newName + ' was used already. Try another.');
            } else {
              pod.name = data.newName;
              this.confData.updatePartOfDay(pod);
            }
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'newName',
          placeholder: 'new descrition here'
        }
      ],
      backdropDismiss: false
    });
    await changeForm.present();
  }

  isTheValueUsed(name) {
    return this.PODs.find(pod => pod.name.toLowerCase() === name.toLowerCase());
  }
}
