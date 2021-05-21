import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeviceTypeListComponent } from './list.component';

describe('DeviceTypeListComponent', () => {
  let component: DeviceTypeListComponent;
  let fixture: ComponentFixture<DeviceTypeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceTypeListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
