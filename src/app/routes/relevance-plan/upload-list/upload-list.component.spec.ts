import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RelevancePlanUploadListComponent } from './upload-list.component';

describe('RelevancePlanUploadListComponent', () => {
  let component: RelevancePlanUploadListComponent;
  let fixture: ComponentFixture<RelevancePlanUploadListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RelevancePlanUploadListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevancePlanUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
