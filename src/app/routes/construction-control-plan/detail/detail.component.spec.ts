import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConstructionControlPlanDetailComponent } from './detail.component';

describe('ConstructionControlPlanDetailComponent', () => {
  let component: ConstructionControlPlanDetailComponent;
  let fixture: ComponentFixture<ConstructionControlPlanDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionControlPlanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionControlPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
