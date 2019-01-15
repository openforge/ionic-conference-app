import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Speaker } from '../../../models';

@Component({
  selector: 'pick-speakers',
  templateUrl: './pick-speakers.page.html',
  styleUrls: ['./pick-speakers.page.scss'],
})
export class PickSpeakersPage implements OnInit {

  queryText = '';
  s_speakers: {
    id: string, name: string, phone: string,
    isChecked: boolean
  }[] = [];

  constructor(private navParams: NavParams,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    const spks = this.navParams.get('speakers');
    const IDs = this.navParams.get('ids');
    spks.forEach(spk => {
      const idx = IDs.findIndex(id => id === spk.id);
      if (idx > -1) {
        this.s_speakers.push({ isChecked: true, id: spk.id, name: spk.name, phone: spk.phone });
      } else {
        this.s_speakers.push({ isChecked: false, id: spk.id, name: spk.name, phone: spk.phone });
      }
    });
  }

  unselectAll() {
    this.s_speakers.forEach(spk => { spk.isChecked = false; });
  }

  applySelection() {
    const IDs = [];
    this.s_speakers.forEach(spk => {
      if (spk.isChecked) {
        IDs.push(spk.id);
      }
    });
    this.dismiss(IDs);
  }

  dismiss(data: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }

}
