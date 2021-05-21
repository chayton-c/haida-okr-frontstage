import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-help-about-us',
  templateUrl: './about-us.component.html',
})
export class HelpAboutUsComponent implements OnInit {
  constructor(private http: _HttpClient) {}

  ngOnInit() {}
}
