import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { PushNotificationOptions, PushNotificationService } from 'ngx-push-notifications';
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
  // readonly VAPID_PUBLIC_KEY =
  //   'BA7qHqj9hLbQ5XqZJI6xhio7XRe9jfP4E3Btlwj37LLtTyiHOhtefTElwy8z5AZkEYNnJjYsJjjnmYH8PRlwoxs';
  firebaseData$;

  constructor(private swPush: SwPush, private db: AngularFirestore, private pushNotificationService: PushNotificationService) {
    this.tasks = db.collection<Item[]>('moxa');
  }
  ngOnInit() {

    this.pushNotificationService.requestPermission();
    console.log('welcome Oninit!');
    this.firebaseData$ = this.tasks
      .snapshotChanges()
      .pipe(map(data =>
          data.map(v => v.payload.doc.data())));
    this.firebaseData$.subscribe(value => {
      if(value[0].error){
      this.subscribeToNotifications(value);
    }
    });

  }

subscribeToNotifications(msg) {
  console.log(msg);
  const  options: PushNotificationOptions = {
    body: msg[0].data,
    icon: 'assets/icons/MoxaIcon.png',
    data:'this is data',
    dir: 'ltr',
    lang: 'zh-Hant',
    vibrate: [100, 50, 200],
    tag: 'confirm-notification',
    renotify: true,
    sticky: true,
    silent: false,
    noscreen: false,
    sound: ''
  };
    this.pushNotificationService.create(this.title, options).subscribe((notif) => {
      if (notif.event.type === 'show') {
        console.log('onshow');
        setTimeout(() => {
          notif.notification.close();
        }, 3000);
      }
      if (notif.event.type === 'click') {
        console.log('click');
        notif.notification.close();
      }
      if (notif.event.type === 'close') {
        console.log('close');
      }
    },
    (err) => {
         console.log(err);
    });
  }
}
