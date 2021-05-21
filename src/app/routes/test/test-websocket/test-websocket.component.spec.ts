import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestTestWebsocketComponent } from './test-websocket.component';

describe('TestTestWebsocketComponent', () => {
  let component: TestTestWebsocketComponent;
  let fixture: ComponentFixture<TestTestWebsocketComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestTestWebsocketComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTestWebsocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
