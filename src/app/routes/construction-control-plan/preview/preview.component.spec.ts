import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConstructionControlPlanPreviewComponent } from './preview.component';

describe('ConstructionControlPlanPreviewComponent', () => {
  let component: ConstructionControlPlanPreviewComponent;
  let fixture: ComponentFixture<ConstructionControlPlanPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionControlPlanPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionControlPlanPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
