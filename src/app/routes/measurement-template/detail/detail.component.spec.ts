import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MeasurementTemplateDetailComponent } from './detail.component';

describe('MeasurementTemplateDetailComponent', () => {
  let component: MeasurementTemplateDetailComponent;
  let fixture: ComponentFixture<MeasurementTemplateDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementTemplateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
