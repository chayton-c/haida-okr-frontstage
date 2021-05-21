import {Injectable, OnInit} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DeviceService implements OnInit {
  akagi: string[];

  constructor() {
    this.akagi = ['1', '2']
  }

  get(): string[] {
    return ['1', '2'];
  }

  ngOnInit(): void {
    console.log(15);
  }
}
