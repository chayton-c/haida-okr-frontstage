import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RelevancePlanRelevanceListComponent } from './relevance-list.component';

describe('RelevancePlanRelevanceListComponent', () => {
  let component: RelevancePlanRelevanceListComponent;
  let fixture: ComponentFixture<RelevancePlanRelevanceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RelevancePlanRelevanceListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevancePlanRelevanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
