import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable, pipe, Subscription, Subscribable } from 'rxjs';
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
  config;
  fullpage_api;

  constructor(private swPush: SwPush, private db: AngularFirestore, private pushNotificationService: PushNotificationService) {
    this.tasks = db.collection<Item[]>('moxa');

    this.config = {
      licenseKey: 'YOUR LICENSE KEY HERE',
      sectionsColor: ['#008787', '#179191', '#2e9c9c', '#45a7a7', '#5cb2b2', '#73bdbd', '#8bc8c8', '#a2d3d3',
      '#a2d3d3', '#8bc8c8', '#73bdbd', '#5cb2b2', '#45a7a7', '#2e9c9c', '#179191', '#008787', '#008787', '#008787', '#008787', '#008787'],
      anchors: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19'],
      navigation: true,
    };
  }
  getRef(fullPageRef) {
    this.fullpage_api = fullPageRef;
  }
  ngOnInit() {

    this.pushNotificationService.requestPermission();
    console.log('welcome Oninit!');
    this.firebaseData$ = this.tasks
      .snapshotChanges()
      .pipe(map(data => data.map(v => v.payload.doc.data())));
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
