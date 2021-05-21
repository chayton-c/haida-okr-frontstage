import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeviceTypeDetailComponent } from './detail.component';

describe('DeviceTypeDetailComponent', () => {
  let component: DeviceTypeDetailComponent;
  let fixture: ComponentFixture<DeviceTypeDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceTypeDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
