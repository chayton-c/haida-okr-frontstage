import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TransferService} from './transfer.service';
import {ActivatedRoute} from "@angular/router";
import {MeasurementTemplate} from "../../../pojos/measurement-template/measurement-template";

@Component({
  selector: 'app-measurement-template-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less'],
  providers: [TransferService],
})
export class MeasurementTemplateDetailComponent implements AfterViewInit, OnInit {
  typeDevice = MeasurementTemplate.DEVICE;
  typeStation = MeasurementTemplate.STATION;
  type:number = -1;

  get item(): TransferService {
    return this.srv;
  }

  constructor(
    private srv: TransferService,
    private activatedRoute: ActivatedRoute,
    )
  {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.item.step = 0;
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.step) this.item.step = queryParams.step;
      if (queryParams.type) this.type = queryParams.type;
    });
  }
}
