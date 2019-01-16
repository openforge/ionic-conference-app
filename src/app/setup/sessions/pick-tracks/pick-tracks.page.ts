import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'pick-tracks',
  templateUrl: './pick-tracks.page.html',
  styleUrls: ['./pick-tracks.page.scss'],
})
export class PickTracksPage implements OnInit {

  queryText = '';
  s_tracks: { name: string, isChecked: boolean }[] = [];

  constructor(private navParams: NavParams,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    const tks = this.navParams.get('tracks');
    const names = this.navParams.get('names');
    tks.forEach(tk => {
      const idx = names.findIndex(name => name === tk.name);
      if (idx > -1) {
        this.s_tracks.push({ isChecked: true, name: tk.name });
      } else {
        this.s_tracks.push({ isChecked: false, name: tk.name });
      }
    });
  }

  unselectAll() {
    this.s_tracks.forEach(tk => { tk.isChecked = false; });
  }

  applySelection() {
    const selected = [];
    this.s_tracks.forEach(tk => {
      if (tk.isChecked) {
        selected.push(tk.name);
      }
    });
    this.dismiss(selected);
  }

  dismiss(data: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }
}
