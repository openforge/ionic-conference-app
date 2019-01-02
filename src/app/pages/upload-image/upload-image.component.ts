import { Component, Output, Input, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent {

  @Input() username: string;
  @Output() exit = new EventEmitter();
  @Output() updateUser = new EventEmitter<string>();

  // Main task
  task: AngularFireUploadTask;

  // State for dropzone CSS toggling
  isHovering: boolean;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // constructor(private db: AngularFirestore) { }
  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (!file || file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    // The storage path
    const path = `avatars/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'My AngularFire-powered PWA!' };

    // const ref = this.storage.ref(path);
    // this.task = ref.put(file, { customMetadata });
    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          this.updateUser.emit(path);
        }
      })
    );
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
