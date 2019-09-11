import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pwa-demo';
  constructor() {
    window.addEventListener('appinstalled', (evt) => {
      console.log('a2hs installed');
    });
  }
  ngOnInit(){
    window.addEventListener('appinstalled', (evt) => {
      console.log('a2hs installed');
    });
  }
}
