import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CenterScreenSetPositionComponent } from './set-position.component';

describe('CenterScreenSetPositionComponent', () => {
  let component: CenterScreenSetPositionComponent;
  let fixture: ComponentFixture<CenterScreenSetPositionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CenterScreenSetPositionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterScreenSetPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
