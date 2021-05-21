import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OperationProcessDatePlanListComponent } from './date-plan-list.component';

describe('OperationProcessDatePlanListComponent', () => {
  let component: OperationProcessDatePlanListComponent;
  let fixture: ComponentFixture<OperationProcessDatePlanListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OperationProcessDatePlanListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationProcessDatePlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
