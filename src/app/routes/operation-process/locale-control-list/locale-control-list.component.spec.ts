import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OperationProcessLocaleControlListComponent } from './locale-control-list.component';

describe('OperationProcessLocaleControlListComponent', () => {
  let component: OperationProcessLocaleControlListComponent;
  let fixture: ComponentFixture<OperationProcessLocaleControlListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OperationProcessLocaleControlListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationProcessLocaleControlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
