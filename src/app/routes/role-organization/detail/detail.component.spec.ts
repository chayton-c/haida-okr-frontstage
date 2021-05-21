import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RoleOrganizationDetailComponent } from './detail.component';

describe('RoleOrganizationDetailComponent', () => {
  let component: RoleOrganizationDetailComponent;
  let fixture: ComponentFixture<RoleOrganizationDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleOrganizationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleOrganizationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
