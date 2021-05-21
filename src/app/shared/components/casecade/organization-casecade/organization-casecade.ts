import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { FormBuilder } from '@angular/forms';
import {NzCascaderOption} from "ng-zorro-antd/cascader/typings";

@Component({
  selector: 'organization-casecade',
  templateUrl: './organization-casecade.html',
})
export class OrganizationCasecade {
  @Input() public values: string[] = [];
  @Output() public valuesChange = new EventEmitter();

  organizationNodes: Array<NzCascaderOption> = [];

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  onChanges($event: any) {
    this.valuesChange.emit($event);
  }

  ngOnInit(): void {
    this.loadSelectTrees();
  }

  loadSelectTrees(): void {
    this.http.post('/api/backstage/organization/initOrganizationCasecade').subscribe((res) => {
      this.organizationNodes = res.organizationSelectTreeNodes;
      this.setDefaultValue(this.organizationNodes)
    });
  }

  setDefaultValue(organizationNodes: Array<NzCascaderOption>|NzCascaderOption[]|undefined) {
    if (!organizationNodes) return;

    console.log(47)
    if (organizationNodes.length == 1) {
      let organizationNode = organizationNodes[0];
      // if (organizationNode.children) {
      //   this.organizationNodes = organizationNode.children;
      //   this.setDefaultValue(organizationNodes);
      //   return;
      // }

      this.values.push(organizationNode.value);
      this.setDefaultValue(organizationNode.children);
    }
  }


}
