import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RailwayLineListComponent } from './list.component';

describe('RailwayLineListComponent', () => {
  let component: RailwayLineListComponent;
  let fixture: ComponentFixture<RailwayLineListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RailwayLineListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RailwayLineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
