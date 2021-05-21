import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConstructionCoordinatePlanListComponent } from './list.component';

describe('ConstructionCoordinatePlanListComponent', () => {
  let component: ConstructionCoordinatePlanListComponent;
  let fixture: ComponentFixture<ConstructionCoordinatePlanListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionCoordinatePlanListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionCoordinatePlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
