import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MeasurementTemplateListComponent } from './list.component';

describe('MeasurementTemplateListComponent', () => {
  let component: MeasurementTemplateListComponent;
  let fixture: ComponentFixture<MeasurementTemplateListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementTemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
