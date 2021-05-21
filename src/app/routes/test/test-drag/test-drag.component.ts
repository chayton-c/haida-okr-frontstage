import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { CdkDragMove } from '@angular/cdk/drag-drop/drag-events';

@Component({
  selector: 'app-test-test-drag',
  templateUrl: './test-drag.component.html',
  styleUrls: ['./test-drag.component.css'],
  styles: [
    `
      .glintHidden {
        display: none;
      }

      .glintShow {
      }

      .blinking {
        animation: opacity 2s ease-in-out infinite;
        opacity: 1;
      }

      @keyframes opacity {
        0% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }
    `,
  ],
})
export class TestTestDragComponent implements OnInit {
  constructor(private http: _HttpClient) {}

  railwayLineId: string | undefined = undefined;
  stationId: string | undefined = undefined;

  lineStationValueChange($event: any) {
    if (($event as string[]).length > 0) this.railwayLineId = $event[0];
    if (($event as string[]).length > 1) this.stationId = $event[1];
  }

  dragPosition = { x: 0, y: 0 };
  dragPositionGlint1 = { x: 895 - 13, y: 432 - 13 };
  dragPositionGlint = { x: 895, y: 432 };

  resetPosition() {
    this.dragPosition = { x: 0, y: 0 };
  }

  savePosition() {}

  openVideo() {
    this.videoplayer.nativeElement.play();
  }

  closeVideo() {
    this.videoplayer.nativeElement.pause();
  }

  blinking = {};
  testImageUrl: string = '/assets/opcimg/status-imgs/2-0.png';

  toggleGlintImg(): void {
    this.videoplayer.nativeElement.play();
    this.blinking = { blinking: true };
    // setTimeout(() => {console.log('closed');this.videoplayer.nativeElement.pause();},1000);
    // this.testImageUrl = '/assets/opcimg/status-imgs/0-0.png';
  }

  @ViewChild('videoPlayer') videoplayer!: ElementRef;

  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  glint = false;
  i = 0;
  style = {};

  setGlint() {
    console.log('this.i-1');
    console.log(this.i);
    // if(this.i > 20) {
    //   console.log("this.i > 20")
    //   console.log(this.i > 20)
    //   return ;
    // }
    // setTimeout(() => {this.i += 1;},2000);
    if (this.i % 2 == 0) {
      this.style = {
        glintHidden: true,
        glintShow: false,
      };
    } else {
      this.style = {
        glintHidden: false,
        glintShow: true,
      };
    }
    // setTimeout(() => {
    //   console.log("I am setTimeout");
    //   this.i+=1;
    //   if(this.i > 20) return;
    //   // this.setGlint();
    // },3000);
    return this.style;
  }

  ngOnInit() {
    // setTimeout(() => {
    //     this.toggleGlintImg();
    // }, 5000);
  }

  // onMouseMove(event: MouseEvent) {
  //   console.log(event);se
  // }
  percentX: string = '';
  percentY: string = '';

  c(a: CdkDragMove<any>) {
    console.log(a.event);

    if ('screenX' in a.event && 'screenY' in a.event) {
      // @ts-ignore
      console.log(a.event.screenX);
      // @ts-ignore
      console.log(a.event.screenX / 1920);

      // @ts-ignore
      console.log(a.event.screenY);
      // @ts-ignore
      console.log(a.event.screenY / 1080);

      this.dragPosition.x = a.event.screenX - 100;
      this.dragPosition.y = a.event.screenY - 100;

      this.percentX = ((a.event.screenX / 1920) * 100).toFixed(2) + '%';
      this.percentY = ((a.event.screenY / 1080) * 100).toFixed(2) + '%';

      console.log('this.percentX');
      console.log(this.percentX);
      console.log('this.percentY');
      console.log(this.percentY);
    }
  }

  getFreeDragPosition(event: Event) {
    console.log(this.dragPosition);
  }

  changePosition() {
    // this.dragPosition = {x: (this.dragPosition.x / 1920) * 100 , y: (this.dragPosition.y / 1080) * 100 };
    this.dragPosition = { x: this.dragPosition.x + 112, y: this.dragPosition.y + 129 };
  }
}
