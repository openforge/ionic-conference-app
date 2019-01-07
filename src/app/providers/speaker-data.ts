import { Injectable } from '@angular/core';
import { AngularFirestore,
         AngularFirestoreCollection,
         AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Speaker } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SpeakerData {
  speakersCollection: AngularFirestoreCollection<Speaker> ;
  speakerDoc: AngularFirestoreDocument<Speaker> ;
  speakers: Observable<Speaker[]> ;
  speaker: Observable<Speaker> ;

  constructor(private afs: AngularFirestore,
              private fireStorage: AngularFireStorage) {
    this.speakersCollection = this.afs.collection(
      'speakers', ref => ref.orderBy('name', 'asc'));
    }

  getSpeakers(): Observable<Speaker[]> {
    this.speakers = this.speakersCollection.snapshotChanges()
      .pipe(map(response => {
        return response.map(action => {
          const data = action.payload.doc.data() as Speaker;
          data.id = action.payload.doc.id;
          if (data.profilePic) {
            this.fireStorage.ref(data.profilePic).getDownloadURL().subscribe(url => {
              data.profilePic = url ? url : '';
            });
          }
          return data;
        });
      }));
    return this.speakers ;
  }

  getSpeaker(id: string) {
    return this.speakersCollection.doc(id).ref.get()
      .then(doc => {
        const speaker = doc.data() as Speaker;
        if (speaker.profilePic) {
          this.fireStorage.ref(speaker.profilePic).getDownloadURL().subscribe(url => {
            speaker.profilePic = url;
          });
        }
        return speaker;
      });
  }

  addNewSpeaker(speaker: Speaker) {
    console.log(speaker);
    this.speakersCollection.add(speaker) ;
  }

  removeSpeaker(speaker: Speaker) {
    const id = speaker.id;
    this.speakerDoc = this.afs.doc(`speakers/${id}`);
    this.speakerDoc.delete();
  }

  updateSpeaker(speaker: Speaker) {
    this.speakerDoc = this.afs.doc(`speakers/${speaker.id}`);
    delete(speaker.id);
    this.speakerDoc.update(speaker);
  }

  getSpeakerName(id: string) {
    this.speakerDoc = this.afs.doc(`speakers/${id}`);
    const name = this.speakerDoc.snapshotChanges.name;
    return name;
  }

  updateSpeakers() {
    this.getSpeakers().subscribe(
      (speakers: Speaker[]) => {
        speakers.forEach( speaker => {
          const id = speaker.id;
          delete(speaker.id);
          speaker.instagram = '';
          speaker.github = 'hogusong';
          if (!speaker.twitter) { speaker.twitter = 'YoungSongJS'; }
          this.speakerDoc = this.afs.doc(`speakers/${id}`);
          this.speakerDoc.update(speaker);
        });
      }
    );
  }

  getUrl(path): Observable<string> {
    return this.fireStorage.ref(path).getDownloadURL();
  }

  deleteUrl(oldUrl) {
    if (oldUrl) {
      this.fireStorage.storage.refFromURL(oldUrl).delete();
    }
  }

  getSpeakerById(id: string) {
    return this.speakersCollection.doc(id).ref.get()
      .then(doc => {
        const speaker = doc.data() as Speaker;
        speaker.id = id;
        if (speaker.profilePic) {
          this.fireStorage.ref(speaker.profilePic).getDownloadURL().subscribe(url => {
            speaker.profilePic = url;
          });
        }
      return speaker;
    });
  }
}
