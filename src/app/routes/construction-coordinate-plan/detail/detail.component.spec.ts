import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConstructionCoordinatePlanDetailComponent } from './detail.component';

describe('ConstructionCoordinatePlanDetailComponent', () => {
  let component: ConstructionCoordinatePlanDetailComponent;
  let fixture: ComponentFixture<ConstructionCoordinatePlanDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionCoordinatePlanDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionCoordinatePlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
