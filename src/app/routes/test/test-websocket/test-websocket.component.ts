import { Component, OnInit } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'test-websocket',
  templateUrl: './test-websocket.component.html',
})
export class TestTestWebsocketComponent implements OnInit {
  msg: any;
  constructor() {
    webSocket('ws://localhost:9000/warningInfoWebSocket').subscribe(
      (msg) => {
        console.log('message received: ');
        console.log(msg);
      },
      (err) => console.log(err),
      () => console.log('complete'),
    );
    webSocket('ws://localhost:9000/constructionDailyPlanWebSocket').subscribe(
      (msg) => {
        console.log('message received: ');
        console.log(msg);
      },
      (err) => console.log(err),
      () => console.log('complete'),
    );
  }

  ngOnInit(): void {}
}
