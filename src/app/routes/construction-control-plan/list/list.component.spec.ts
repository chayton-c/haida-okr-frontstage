import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConstructionControlPlanListComponent } from './list.component';

describe('ConstructionControlPlanListComponent', () => {
  let component: ConstructionControlPlanListComponent;
  let fixture: ComponentFixture<ConstructionControlPlanListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionControlPlanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionControlPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
