import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Item {
  error: boolean;
  data: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pwa-demo';
  public tasks: AngularFirestoreCollection<Item[]>;
  // private ItemCollection: AngularFirestoreCollection<Item>;
  // items: Observable<Item[]>;
  readonly VAPID_PUBLIC_KEY =
    'BA7qHqj9hLbQ5XqZJI6xhio7XRe9jfP4E3Btlwj37LLtTyiHOhtefTElwy8z5AZkEYNnJjYsJjjnmYH8PRlwoxs';

  constructor(private swPush: SwPush, private db: AngularFirestore) {
    this.tasks = db.collection<Item[]>('moxa');
  }
  ngOnInit() {
    console.log('welcome Oninit!');
    this.tasks
      .snapshotChanges()
      .pipe(map(data => data.map(v => v.payload.doc.data())))
      .subscribe(value => {
        console.log(...value);
      });
  }
}
