import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LineLocationDataListComponent } from './list.component';

describe('LineLocationDataListComponent', () => {
  let component: LineLocationDataListComponent;
  let fixture: ComponentFixture<LineLocationDataListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineLocationDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineLocationDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
