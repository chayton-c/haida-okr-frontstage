import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConstructionFormalPlanSignInComponent } from './sign-in.component';

describe('ConstructionFormalPlanSignInComponent', () => {
  let component: ConstructionFormalPlanSignInComponent;
  let fixture: ComponentFixture<ConstructionFormalPlanSignInComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionFormalPlanSignInComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionFormalPlanSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
