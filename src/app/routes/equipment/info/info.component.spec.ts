import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EquipmentInfoComponent } from './info.component';

describe('EquipmentInfoComponent', () => {
  let component: EquipmentInfoComponent;
  let fixture: ComponentFixture<EquipmentInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
