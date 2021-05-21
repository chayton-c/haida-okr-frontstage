import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpcListComponent } from './list.component';

describe('OpcListComponent', () => {
  let component: OpcListComponent;
  let fixture: ComponentFixture<OpcListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
