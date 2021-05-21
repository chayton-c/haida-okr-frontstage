import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OperationProcessWarningInformationListComponent } from './warning-information-list.component';

describe('OperationProcessWarningInformationListComponent', () => {
  let component: OperationProcessWarningInformationListComponent;
  let fixture: ComponentFixture<OperationProcessWarningInformationListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OperationProcessWarningInformationListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationProcessWarningInformationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
