import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-construction-coordinate-plan-detail',
  templateUrl: './detail.component.html',
})
export class ConstructionCoordinatePlanDetailComponent implements OnInit {
  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  ngOnInit(): void {}
}
