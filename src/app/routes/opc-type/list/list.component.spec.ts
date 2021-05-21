import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpcTypeListComponent } from './list.component';

describe('OpcTypeListComponent', () => {
  let component: OpcTypeListComponent;
  let fixture: ComponentFixture<OpcTypeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
