import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConstructionFormalPlanDetailComponent } from './detail.component';

describe('ConstructionFormalPlanDetailComponent', () => {
  let component: ConstructionFormalPlanDetailComponent;
  let fixture: ComponentFixture<ConstructionFormalPlanDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionFormalPlanDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionFormalPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
