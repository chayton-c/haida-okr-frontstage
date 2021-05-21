import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestTestDragComponent } from './test-drag.component';

describe('TestTestDragComponent', () => {
  let component: TestTestDragComponent;
  let fixture: ComponentFixture<TestTestDragComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTestDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTestDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
