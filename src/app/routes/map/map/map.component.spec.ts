import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MapMapComponent } from './map.component';

describe('MapMapComponent', () => {
  let component: MapMapComponent;
  let fixture: ComponentFixture<MapMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
