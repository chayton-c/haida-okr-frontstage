import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpcOpcStationComponent } from './opc-station.component';

describe('OpcOpcStationComponent', () => {
  let component: OpcOpcStationComponent;
  let fixture: ComponentFixture<OpcOpcStationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcOpcStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcOpcStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
