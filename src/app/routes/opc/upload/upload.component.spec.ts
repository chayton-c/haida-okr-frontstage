import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpcUploadComponent } from './upload.component';

describe('OpcUploadComponent', () => {
  let component: OpcUploadComponent;
  let fixture: ComponentFixture<OpcUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
