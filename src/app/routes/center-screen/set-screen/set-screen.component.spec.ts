import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CenterScreenSetScreenComponent } from './set-screen.component';

describe('CenterScreenSetScreenComponent', () => {
  let component: CenterScreenSetScreenComponent;
  let fixture: ComponentFixture<CenterScreenSetScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CenterScreenSetScreenComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterScreenSetScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
