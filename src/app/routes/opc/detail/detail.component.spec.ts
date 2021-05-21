import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpcDetailComponent } from './detail.component';

describe('OpcDetailComponent', () => {
  let component: OpcDetailComponent;
  let fixture: ComponentFixture<OpcDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
