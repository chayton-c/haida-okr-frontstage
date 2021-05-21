import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-help-project-significance',
  templateUrl: './project-significance.component.html',
})
export class HelpProjectSignificanceComponent implements OnInit {
  constructor(private http: _HttpClient) {}

  ngOnInit() {}
}
