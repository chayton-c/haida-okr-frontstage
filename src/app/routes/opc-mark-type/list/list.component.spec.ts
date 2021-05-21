import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpcMarkTypeListComponent } from './list.component';

describe('OpcMarkTypeListComponent', () => {
  let component: OpcMarkTypeListComponent;
  let fixture: ComponentFixture<OpcMarkTypeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcMarkTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcMarkTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
