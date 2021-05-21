import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RailwayLineSectionListComponent } from './list.component';

describe('LineLocationDataListComponent', () => {
  let component: RailwayLineSectionListComponent;
  let fixture: ComponentFixture<RailwayLineSectionListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RailwayLineSectionListComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RailwayLineSectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
