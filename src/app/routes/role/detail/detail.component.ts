import {AfterViewInit, Component, OnInit} from '@angular/core';
import { _HttpClient} from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import {Role} from "../../../pojos/auth/role/role";
import {Menu} from "../../../pojos/auth/menu/menu";
import {TransferService} from "./transfer.service";


@Component({
  selector: 'app-role-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less'],
  providers: [TransferService],
})
export class RoleDetailComponent implements AfterViewInit {
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
    this.item.step = 0;
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.step) this.item.step = queryParams.step;
    });
  }
}
