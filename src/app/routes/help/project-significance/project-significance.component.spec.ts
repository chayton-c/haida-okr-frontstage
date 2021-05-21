import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelpProjectSignificanceComponent } from './project-significance.component';

describe('HelpProjectSignificanceComponent', () => {
  let component: HelpProjectSignificanceComponent;
  let fixture: ComponentFixture<HelpProjectSignificanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HelpProjectSignificanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpProjectSignificanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
