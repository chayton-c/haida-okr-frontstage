import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OperationProcessListComponent } from './list.component';

describe('OperationProcessListComponent', () => {
  let component: OperationProcessListComponent;
  let fixture: ComponentFixture<OperationProcessListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OperationProcessListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
