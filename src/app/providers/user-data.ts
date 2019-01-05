import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AngularFirestore,
         AngularFirestoreCollection,
         AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class UserData {
  usersCollection: AngularFirestoreCollection<User> ;
  userDoc: AngularFirestoreDocument<User> ;
  users: Observable<User[]> ;
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(private afs: AngularFirestore,
              private fireStorage: AngularFireStorage,
              public events: Events,
              public storage: Storage) {
    this.usersCollection = this.afs.collection(
      'users', ref => ref.orderBy('username', 'asc'));
  }

  getUsers(): Observable<User[]> {
    this.users = this.usersCollection.snapshotChanges()
      .pipe(map(response => {
        return response.map(action => {
          const data = action.payload.doc.data() as User;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
    return this.users;
  }

  signup(user: User) {
    this.usersCollection.add(user)
      .then(res => {
        user.id = res.id;
        this.login(user);
      });
  }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  login(user: User): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUser(user);
      return this.events.publish('user:login');
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('user');
    }).then(() => {
      this.events.publish('user:logout');
    });
  }

  setUser(user: User): Promise<any> {
    return this.storage.set('user', user);
  }

  updateUser(user: User) {
    const id = user.id;
    delete(user.id);
    this.userDoc = this.afs.doc(`users/${id}`);
    this.userDoc.update(user);
  }

  addTrackInUser(name) {
    const track = { name: name, isChecked: false };
    this.getUsers().subscribe(users => {
      users.forEach(user => {
        const idx = user.trackFilter.findIndex(item => item.name === name);
        if (idx < 0) {
          user.trackFilter.push(track);
          this.updateUser(user);
        }
      });
      // const len = users.length;
      // for (let i=0; i<len; i++) {
      //   users[i].trackFilter.push(track);
      //   this.updateUser(users[i]);
      // }
    });
  }

  updateTracksInUser(newName: string, oldName: string) {
    this.getUsers().subscribe(users => {
      users.forEach(user => {
        const idx = user.trackFilter.findIndex(track => track.name === oldName);
        if (idx > -1) {
          user.trackFilter[idx].name = newName;
          this.updateUser(user);
        }
      });
    });
  }

  removeTrackInUser(name) {
    this.getUsers().subscribe(users => {
      users.forEach(user => {
        const idx = user.trackFilter.findIndex(track => track.name === name);
        if (idx > -1) {
          user.trackFilter.splice(idx, 1);
          this.updateUser(user);
        }
      });
    });
  }

  deleteUrl(oldUrl) {
    if (oldUrl) {
      this.fireStorage.storage.refFromURL(oldUrl).delete();
    }
  }

  getUserById(id: string) {
    return this.usersCollection.doc(id).ref.get()
      .then(doc => {
        const user = doc.data() as User;
        user.id = id;
        if (user.avatar) {
          this.fireStorage.ref(user.avatar).getDownloadURL().subscribe(url => {
            user.avatar = url;
          });
        }
      return user;
    });
  }

  getUser(): Promise<User> {
    return this.storage.get('user').then(user => user);
  }

  getUsername(): Promise<string> {
    return this.storage.get('user').then(value => value.username);
  }

  getUserId(): Promise<string> {
    return this.storage.get('user').then(value => value.id);
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then(value => value);
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then(value => value);
  }
}
